const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const redisClient = require("../config/redis");

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
}

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const token = generateToken(user);
  // persist token on the user document
  user.token = token;
  await user.save();
  res
    .status(201)
    .json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });
  const token = generateToken(user);
  // persist token on signin
  user.token = token;
  await user.save();
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

exports.logout = async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(400).json({ message: "Missing Authorization header" });
    const token = header.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Invalid Authorization header" });

    const decoded = jwt.decode(token);
    // if no exp, set short TTL
    const expiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + 1000 * 60 * 60;
    const ttlSec = Math.max(1, Math.ceil((expiresAt - Date.now()) / 1000));

    await redisClient.setex(`bl:${token}`, ttlSec, "1");
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
