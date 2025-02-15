"use client";
import Image from "next/image";
import Link from "next/link";
import * as ietko from "@/app/images/ietko.png";
import * as shaorostav from "@/app/images/shaorostav.png";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function QRpage() {
  const [scanResult, setScanResult] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // null, success, error
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (showPopup) return; // Stop scanner when popup is open

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 }, // QR scanning box size
    });

    scanner.render(
      (decodedText) => {
        setScanResult("data scanned");
        const data = JSON.parse(decodedText);
        setShowPopup(true);
        console.log(data.userID)
        verifyEntry(data['userID']); // Call verification API
        scanner.clear(); // Stop scanning
      },
      (error) => console.log(error)
    );

    return () => scanner.clear();
  }, [showPopup]);

  // 🛠️ Verify Entry Function
  const verifyEntry = async (userID) => {
    setIsVerifying(true);
    try {
      const response = await axios.post("http://localhost:8000/verify-entry", { userID });
  
      if (response.data.message=="Entry granted") {
        setVerificationStatus("success");  // ✅ Entry successfully granted
      } else if (response.data.message === "Entry already granted") {
        setVerificationStatus("alreadyGranted"); // ⚠️ Entry was already granted
      } else {
        setVerificationStatus("error");  // ❌ Entry not found or other errors
      }
    } catch (error) {
      setVerificationStatus("error");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-[url('./images/hero_image.jpg')] bg-fixed bg-cover bg-center bg-no-repeat">
      {/* 🏠 HEADER */}
      <header>
        <div className="bg-gray-800 flex justify-between items-center p-4">
          <Image src={ietko} alt="IET logo" width={52} height={52} />
          <Link
            href="/"
            className="mt-4 text-white hover:text-gray-300 underline font-semibold transition duration-300 ease-in-out"
          >
            Dashboard
          </Link>
          <Image src={shaorostav} alt="Shaurya Utsav logo" width={150} height={60} />
        </div>
      </header>

      {/* 📸 QR Scanner */}
      <div className="flex items-center justify-center min-h-screen">
        {!showPopup && (
          <div className="w-48 p-2 bg-white rounded-lg shadow-lg border border-gray-300">
            <div id="qr-reader" className="w-36 h-50 mx-auto"></div>
            <p className="text-center text-sm mt-2 font-medium">Scan a QR code</p>
          </div>
        )}

        {/* 🔍 Popup with Verification Status */}
        {showPopup && (
      <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
        {/* ❌ Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 text-xl"
          onClick={() => {
            setShowPopup(false);
            setVerificationStatus(null);
          }}
        >
          ✖
        </button>
    
        <h2 className="text-lg font-semibold">QR Code Scanned!</h2>
        <p className="mt-2 text-gray-700">{scanResult}</p>
    
        {/* 🔄 Loading Indicator */}
        {isVerifying && <p className="text-blue-500 mt-3">Verifying...</p>}
    
        {/* ✅ Success Animation */}
        {verificationStatus === "success" && (
          <motion.div
            className="text-green-500 text-4xl mt-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ✅ Entry Granted!
          </motion.div>
        )}
    
        {/* ⚠️ Entry Already Granted Message */}
        {verificationStatus === "alreadyGranted" && (
          <motion.div
            className="text-yellow-500 text-4xl mt-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ⚠️ Entry Already Granted!
          </motion.div>
        )}
    
        {/* ❌ Error Message */}
        {verificationStatus === "error" && (
          <p className="text-red-500 mt-3">Verification Failed!</p>
        )}
      </div>
    </motion.div>
        )}
      </div>
    </div>
  );
}
