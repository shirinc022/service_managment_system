const nodemailer = require("nodemailer");
require('dotenv').config()
const contact = async (req, res) => {
    const { name, email, message } = req.body;
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,  // Use TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from:  `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email, // Makes it easy to reply back
        subject: `New Contact from ${name}`,
        text: message.trim(), // Trim unnecessary whitespace
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Email Sending Error:", error);
        res.status(500).json({ message: "Error sending message" });
    }
};

module.exports = { contact };
