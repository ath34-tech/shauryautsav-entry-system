import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function UserForm({ setOpenStatus }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentId: "",
    paymentStatus: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [qrCodeURL, setQrCodeURL] = useState(null);
  const [fileID, setFileID] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Phone validation (must be 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // Payment ID validation
    if (!formData.paymentId.trim()) {
      newErrors.paymentId = "Payment ID is required.";
    }

    // Payment Status validation
    if (!formData.paymentStatus) {
      newErrors.paymentStatus = "Please select a payment status.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setQrCodeURL(null);

    try {
      const response = await axios.post("http://localhost:8000/generate-qr", {
        name: formData.name,
        email: formData.email,
        paymentID: formData.paymentId,
      });

      if (response.data.success) {
        setQrCodeURL(response.data.qrCodeURL);
        setFileID(getGoogleDriveFileId(response.data.qrCodeURL));
        alert("QR Code generated successfully!");

        setFormData({
          name: "",
          email: "",
          phone: "",
          paymentId: "",
          paymentStatus: "",
        });
      } else {
        alert("Failed to generate QR Code.");
      }
    } catch (error) {
      console.error("Error generating QR Code:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  function getGoogleDriveFileId(url) {
    const match = url.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{33})/);
    return match ? match[1] : null;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md relative">
      <button
        onClick={() => setOpenStatus(false)}
        className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
      >
        <X size={20} />
      </button>
      <h2 className="text-2xl font-semibold text-center mb-4">User Details Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div>
  <Label htmlFor="phone">Phone Number</Label>
  <Input
    id="phone"
    name="phone"
    type="tel"
    value={formData.phone}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
      if (value.length <= 10) {
        setFormData({ ...formData, phone: value });
      }
    }}
    pattern="\d{10}"
    maxLength="10"
    required
    placeholder="Enter 10-digit phone number"
  />
</div>

        {/* Payment ID */}
        <div>
          <Label htmlFor="paymentId">Payment ID</Label>
          <Input id="paymentId" name="paymentId" value={formData.paymentId} onChange={handleChange} required />
          {errors.paymentId && <p className="text-red-500 text-sm">{errors.paymentId}</p>}
        </div>

        {/* Payment Status */}
        <div>
          <Label htmlFor="paymentStatus">Payment Status</Label>
          <Select 
            value={formData.paymentStatus} 
            onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentStatus && <p className="text-red-500 text-sm">{errors.paymentStatus}</p>}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Generating QR..." : "Submit"}
        </Button>
      </form>

      {/* QR Code Display */}
      {qrCodeURL && (
        <div className="mt-4 text-center">
          <img src={`https://drive.google.com/uc?export=view&id=${fileID}`} alt="QR Code" className="mx-auto w-32 h-32" />
          <Button onClick={() => handleDownloadQR(fileID)} className="mt-2">Download QR Code</Button>
        </div>
      )}
    </div>
  );
}
