const fs = require("fs");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const FOLDER_ID = "1suWXwggGuHnvBrEIACfOlHmwujPjgNii"; // Replace with your folder ID

const auth = new google.auth.GoogleAuth({
  keyFile: "googleServiceAccount.json", // Ensure this file exists in your project root
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

async function uploadToGoogleDrive(base64Image, filename) {
  try {
    // Convert base64 image to a buffer and save as a temporary file
    const buffer = Buffer.from(base64Image.split(",")[1], "base64");
    const tempFilePath = `./temp-${filename}`;
    fs.writeFileSync(tempFilePath, buffer);

    const response = await drive.files.create({
      requestBody: {
        name: filename,
        parents: [FOLDER_ID], // Upload inside the shared folder
      },
      media: {
        mimeType: "image/png",
        body: fs.createReadStream(tempFilePath),
      },
    });

    // Remove temp file after upload
    fs.unlinkSync(tempFilePath);

    // Get public URL
    const fileId = response.data.id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    const fileURL = `https://drive.google.com/uc?id=${fileId}`;
    return fileURL;
  } catch (error) {
    console.error("Google Drive Upload Error:", error);
    return null;
  }
}

module.exports = { uploadToGoogleDrive };
