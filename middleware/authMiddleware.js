// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });
  token = token.split(" ")[1]; // Remove "Bearer" prefix

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(500).json({ message: "Failed to authenticate token" });
    req.user = decoded;
    next();
  });
};
