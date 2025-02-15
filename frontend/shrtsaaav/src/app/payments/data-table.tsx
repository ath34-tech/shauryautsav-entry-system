'use client';
import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DataTable({ setOpenStatus }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/users").then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  }, []);

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  function getGoogleDriveFileId(url) {
    const match = url.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{33})/);
    return match ? match[1] : null;
  }

  const handleDownloadQR = async (fileId) => {
    if (!fileId) return;

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto p-4">
      {/* 🔹 Add User Button */}
      <Button onClick={() => setOpenStatus(true)} className="mb-4">
        Add User
      </Button>

      {/* 🔹 Fixed Table Wrapper with Scroll & White Background */}
      <div className="w-full max-w-5xl mx-auto border rounded-lg shadow-lg bg-white">
        <div className="overflow-y-auto h-[400px]">
          <Table className="w-full min-w-[600px] bg-white">
            <TableHeader className="bg-white sticky top-0 z-10 border-b">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Entry Status</TableHead>
                <TableHead>Copy Link</TableHead>
                <TableHead>Download QR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id} className="text-sm md:text-base">
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className={user.entryGranted ? "text-green-500" : "text-red-500"}>
                    {user.entryGranted ? "Granted" : "Not Granted"}
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => copyToClipboard(user.qrCodeURL)} 
                      className="w-full md:w-auto"
                    >
                      Copy Link
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleDownloadQR(getGoogleDriveFileId(user.qrCodeURL))}
                      className="w-full md:w-auto"
                    >
                      Download QR
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
