// /backend/routes/logRoute.js
const express = require('express');
const router = express.Router();
const logger = require('../Logs/logger');

router.post('/logs', (req, res) => {
  const { level, message } = req.body;

  if (!level || !message) {
    return res.status(400).send('Missing log level or message');
  }

  // Dynamically call the correct log level method
  if (logger[level]) {
    logger[level](message); // e.g., logger.info("Message")
  } else {
    logger.info(`[UNKNOWN LEVEL] ${message}`);
  }

  res.status(200).send('Log received');
});

module.exports = router;
