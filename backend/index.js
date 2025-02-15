const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const QRCode = require("qrcode");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const { uploadToGoogleDrive } = require("./googleDriveUploader");

admin.initializeApp({
  credential: admin.credential.cert(require("./firebaseServiceAccount.json")),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());
// 1suWXwggGuHnvBrEIACfOlHmwujPjgNii folder id
// Generate QR Code for a user
app.post("/generate-qr", async (req, res) => {
  const { name, email, paymentID } = req.body;
  try {
    const userID = uuidv4();
    const qrData = JSON.stringify({ userID, name, email });
    const qrCodeImage = await QRCode.toDataURL(qrData);
    const qrCodeURL = await uploadToGoogleDrive(qrCodeImage, `${userID}.png`);
    await db.collection("shauryautsav_entries").doc(userID).set({
        id: userID,
        name,
        email,
        qrCodeURL,
        paymentID,
        entryGranted: false
      });
      

    res.json({ success: true, qrCodeURL });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify QR Code Scan
app.post("/verify-entry", async (req, res) => {
  const { userID } = req.body;
  try {
    const userDoc = await db.collection("shauryautsav_entries").doc(userID).get();
    const userData = userDoc.data();
    if (userData.entryGranted) {
      return res.json({ success: false, message: "Entry already granted" });
    }
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await db.collection("shauryautsav_entries").doc(userID).update({ entryGranted: true });
    res.json({ success: true, message: "Entry granted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("shauryautsav_entries").get();
    const users = snapshot.docs.map(doc => doc.data());

    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
