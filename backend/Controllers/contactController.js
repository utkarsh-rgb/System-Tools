const pool = require('../Models/db');

const contact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const query = "INSERT INTO contact_message (name, email, message) VALUES (?, ?, ?)";
  
  try {
    await pool.execute(query, [name, email, message]);
    res.status(201).json({ message: "Message submitted successfully" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = { contact };
