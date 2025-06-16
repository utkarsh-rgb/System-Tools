const express = require("express");
const router = express.Router();
const sendResetEmail = require("./sendResetEmail");
const crypto = require("crypto");
const pool = require("../Models/db");

// POST /forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate secure reset token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const resetLink = `http://localhost:5173/reset-password/${token}`;
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000); 

    // Store token and expiry in database
    await pool.execute(
      "UPDATE users SET resetToken = ?, tokenExpiry = ? WHERE email = ?",
      [token, expiryTime, email]
    );

    // Send email with reset link
    await sendResetEmail(email, resetLink);

    res.json({ message: "Password reset email sent successfully." });

  } catch (err) {
    console.error("Error during password reset:", err);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
});

module.exports = router;
