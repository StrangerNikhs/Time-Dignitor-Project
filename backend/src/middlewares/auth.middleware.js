const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const redisClient = require("../config/redis");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ message: "Missing Authorization header" });
    const token = header.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid Authorization header" });
    // reject if token is blacklisted
    const black = await redisClient.get(`bl:${token}`);
    if (black) return res.status(401).json({ message: "Token revoked" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
