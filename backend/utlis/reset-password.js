const express = require("express");
const router = express.Router();
const pool = require("../Models/db");
const bcrypt = require("bcrypt");

// POST /reset-password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  try {
    // Find user by token and check expiry
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE resetToken = ? AND tokenExpiry > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const user = rows[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear token fields
    await pool.execute(
      "UPDATE users SET password = ?, resetToken = NULL, tokenExpiry = NULL WHERE email = ?",
      [hashedPassword, user.email]
    );

    res.json({ message: "Password has been successfully reset." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Something went wrong. Try again later." });
  }
});

module.exports = router;
