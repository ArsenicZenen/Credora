const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name and password" });
    }
    const existing = await User.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, password: hashed });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    console.log("📥 Login request body:", req.body);
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user)
      return res.status(400).json({ message: "Invalid name or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.json({
      message: "Login Successfull",
      token,
      user: { name: user.name },
    });
  } catch (err) {
    console.error("💥 Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-name", auth, async (req, res) => {
  try {
    const { newName } = req.body;
    if (!newName) {
      return res.status(400).json({ message: "New name is required" });
    }
    const existing = await User.findOne({ name: newName });
    if (existing)
      return res.status(400).json({ message: "That name is already taken" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name: newName },
      { new: true }
    );
    res.json({
      message: "Name updated successfully",
      user: { name: updatedUser.name },
    });
  } catch (err) {
    console.log(err);
  }
});

router.put("/update-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("💥 Update password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// routes/auth.js
router.post("/verify-password",auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    res.json({ message: "Password verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", (req, res) => {
  res.send("Auth route working:)");
});

module.exports = router;
