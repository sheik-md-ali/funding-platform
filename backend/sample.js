import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react"; 

function App() {
    const [studentId, setStudentId] = useState("");
    const [upiLink, setUpiLink] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch UPI Payment Link from Backend
    const generateQr = async () => {
        try {
            setLoading(true);
            console.log("Requesting QR for Student ID:", studentId);
            const response = await axios.post("http://localhost:5000/generate-qr", { studentId });

            if (response.data.success) {
                setUpiLink(response.data.upiLink);
            } else {
                alert("Failed to generate QR: " + response.data.error);
            }
        } catch (error) {
            console.error("Error generating QR code", error);
            alert("Error generating QR. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ color: "#333" }}>Micro Donation Platform</h1>

            {/* Input for Student ID */}
            <input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={{ padding: "10px", marginRight: "10px", fontSize: "16px" }}
            />
            <button 
                onClick={generateQr} 
                style={{ 
                    padding: "10px 15px", 
                    backgroundColor: "#007bff", 
                    color: "white", 
                    fontSize: "16px", 
                    border: "none", 
                    borderRadius: "5px", 
                    cursor: "pointer"
                }}
            >
                {loading ? "Generating..." : "Generate QR"}
            </button>

            {/* Donation Section */}
            {upiLink && (
                <div style={{
                    marginTop: "20px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    maxWidth: "400px",
                    margin: "auto"
                }}>
                    <h2>Support This Student</h2>
                    <img 
                        src="https://via.placeholder.com/150" 
                        alt="Student Image"
                        style={{ borderRadius: "10px", width: "100%", marginBottom: "10px" }} 
                    />
                    <p><strong>Student Name:</strong> Student {studentId || "XYZ"}</p>
                    <p><strong>Required Amount:</strong> ₹5,000</p>
                    
                    {/* Pay Now Button (Only for Mobile) */}
                    <p><strong>📱 Mobile Users:</strong></p>
                    <a href={upiLink} target="_blank" rel="noopener noreferrer">
                        <button style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            padding: "10px",
                            borderRadius: "5px",
                            fontSize: "16px",
                            width: "100%",
                            marginBottom: "10px",
                            cursor: "pointer"
                        }}>
                            Pay Now (Open in UPI App)
                        </button>
                    </a>

                    {/* Copy UPI Link for Laptop Users */}
                    <p><strong>💻 Laptop Users:</strong></p>
                    <input type="text" value={upiLink} readOnly style={{ width: "100%", padding: "5px" }} />
                    <button 
                        onClick={() => navigator.clipboard.writeText(upiLink)}
                        style={{
                            marginTop: "10px",
                            padding: "8px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            width: "100%"
                        }}
                    >
                        Copy UPI Link
                    </button>

                    {/* QR Code */}
                    <h3>Or Scan QR to Donate</h3>
                    <QRCodeCanvas value={upiLink} size={200} />
                </div>
            )}
        </div>
    );
}

export default App;
