const express = require("express");
const router = express.Router();
const pool = require("../Models/db");

router.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required." });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE resetToken = ? AND tokenExpiry > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }

    res.json({ success: true, message: "Token is valid." });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
