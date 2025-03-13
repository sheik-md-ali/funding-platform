import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react"; 

function App() {
    const [studentId, setStudentId] = useState("");
    const [upiLink, setUpiLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);

    // Fetch UPI Payment Link and Student Details
    const generateQr = async () => {
        try {
            setLoading(true);
            console.log("Requesting QR for Student ID:", studentId);
            const response = await axios.post("http://localhost:5000/generate-qr", { studentId });

            if (response.data.success) {
                setUpiLink(response.data.upiLink);
                setStudentData({
                    name: response.data.name,
                    image: response.data.image,
                    amountRequired: response.data.amountRequired,
                    description: response.data.description
                });
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

    // Share UPI Link
    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Support This Student",
                    text: `Help ${studentData.name} by donating here:`,
                    url: upiLink
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            alert("Sharing not supported in this browser.");
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
            {upiLink && studentData && (
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
                        src={studentData.image} 
                        alt="Student"
                        style={{ borderRadius: "10px", width: "100%", marginBottom: "10px" }} 
                    />
                    <p><strong>Student Name:</strong> {studentData.name}</p>
                    <p><strong>Required Amount:</strong> ₹{studentData.amountRequired}</p>
                    <p><strong>Description:</strong> {studentData.description}</p>

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

                    {/* Share Button */}
                    <button 
                        onClick={shareLink}
                        style={{
                            marginTop: "10px",
                            padding: "10px",
                            backgroundColor: "#ff5722",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            width: "100%"
                        }}
                    >
                        Share QR/Link
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
