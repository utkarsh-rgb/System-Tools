const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.token;  // get token from cookies

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = {authenticateToken};
