const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require('../Models/db');
const logger = require('../Logs/logger'); 
require("dotenv").config();

const signup = async (req, res) => {
  const { username, name, email, password, confirmPassword } = req.body;

  if (!username || !name || !email || !password || !confirmPassword) {
    logger.warn("Signup failed: Missing fields");
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  if (password !== confirmPassword) {
    logger.warn(`Signup failed: Passwords don't match for ${username}`);
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, name, email, password, flag) VALUES (?, ?, ?, ?, 2)";
    
    await pool.query(query, [username, name, email, hashedPassword]);

    logger.info(`User registered: ${username} (${email})`);
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      logger.warn(`Signup failed: Duplicate entry for ${username} or ${email}`);
      return res.status(409).json({ message: "Username or email already exists" });
    }
    logger.error(`Signup error for ${username}: ${err.message}`);
    res.status(500).json({ message: "Database error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn("Login failed: Missing username or password");
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const [results] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

    if (results.length === 0) {
      logger.warn(`Login failed: Invalid username ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Login failed: Wrong password for ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { name: user.username, role: user.flag },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    logger.info(`User logged in: ${username}`);
    res.status(200).json({
      message: `Welcome, ${user.name}!`,
      username: user.username,
      role: user.flag === 1 ? "admin" : "user",
    });

  } catch (err) {
    logger.error(`Login error for ${username}: ${err.message}`);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = { signup, login };
