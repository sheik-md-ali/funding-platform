const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// 📌 Student UPI details and other data
const students = {
    "1": { 
        name: "Student One", 
        upiId: "6381773978shaikh@ibl", 
        image: "https://via.placeholder.com/150",
        amountRequired: 5000, 
        description: "A bright student seeking financial assistance for academic expenses." 
    },
    "2": { 
        name: "Student Two", 
        upiId: "student2@upi", 
        image: "https://via.placeholder.com/150",
        amountRequired: 7000, 
        description: "An aspiring engineer needing support for tuition fees."
    }
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

        // Generate UPI Payment Link
        const upiLink = `upi://pay?pa=${student.upiId}&pn=${encodeURIComponent(student.name)}&cu=INR`;

        console.log("Generated UPI Payment URL:", upiLink);

        res.json({ 
            success: true, 
            upiLink, 
            studentId, 
            name: student.name, 
            image: student.image, 
            amountRequired: student.amountRequired, 
            description: student.description 
        });

    } catch (error) {
        console.error("Error in backend:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
