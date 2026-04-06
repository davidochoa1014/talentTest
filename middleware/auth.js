const jwt = require("jsonwebtoken");
const {  JWT_SECRET } = require('../config/constants');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
//console.log("AUTH MIDDLEWARE HIT:", req.method, req.url);
  if (!authHeader) {
    return res.status(401).json({ msg: "No token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ msg: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};