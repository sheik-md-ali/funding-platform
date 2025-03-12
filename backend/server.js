const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// 📌 Student UPI details (each student has a unique UPI ID)
const students = {
    "1": { name: "Student One", upiId: "6381773978shaikh@ibl" },
    "2": { name: "Student Two", upiId: "student2@upi" }
};

// 📌 Generate UPI Payment Link
app.post("/generate-qr", (req, res) => {
    try {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ success: false, error: "Missing Student ID" });
        }

        const student = students[studentId];
        if (!student) {
            return res.status(400).json({ success: false, error: "Student not found" });
        }

        // Generate UPI Payment Link (Donor enters amount manually)
        const upiLink = `upi://pay?pa=${student.upiId}&pn=${encodeURIComponent(student.name)}&cu=INR`;

        console.log("Generated UPI Payment URL:", upiLink);

        res.json({ success: true, upiLink, studentId });

    } catch (error) {
        console.error("Error in backend:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
