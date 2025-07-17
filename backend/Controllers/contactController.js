const pool = require('../Models/db');
const logger = require('../Logs/logger');

const contact = async (req, res) => {
  const { name, email, message } = req.body;

  logger.info(`Received contact form: name=${name}, email=${email}`);

  if (!name || !email || !message) {
    logger.warn('Contact form submission failed: Missing fields');
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const query = "INSERT INTO contact_message (name, email, message) VALUES (?, ?, ?)";
  
  try {
    await pool.execute(query, [name, email, message]);
    logger.info(`Contact form saved: ${email}`);
    res.status(201).json({ message: "Message submitted successfully" });
  } catch (err) {
    logger.error(`DB Error: ${err.message}`);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = { contact };
