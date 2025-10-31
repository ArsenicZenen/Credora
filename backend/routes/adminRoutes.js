const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Transaction = require("../models/Transaction");
const isAdmin = require("../middleware/adminAuth");
// const { findById } = require("../models/Transaction");
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
     return res.json({ message: "Access Forbidden!" });
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
     return res.json({ message: "Wrong Password" });
    }
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      admin: { name: admin.name },
      message: "Logged in Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
//get all transactions
router.get("/transactions", isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name") // 🔥 This will show the user's name
      .sort({ createdAt: -1 }); // Optional: newest first

    res.json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// routes/adminRoutes.js
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }); // optional: exclude other admins
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/transactions/:id", isAdmin, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction Not Found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
router.delete("/users/:id", isAdmin, async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await User.findById(req.params.id);
    await User.findByIdAndDelete(req.params.id);
     await Transaction.deleteMany({user: req.params.id});
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server Error" });
  }
});
// ADD USers
router.post("/users", isAdmin, async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Name and password are required" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      password: hashedPassword,
      role: "user", // normal user
    });

    await newUser.save();

    res.status(201).json(newUser); // return the created user
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


//Edit Transactions
router.put("/transactions/:id", isAdmin, async (req, res) => {
  try {
    const updateData = req.body; // e.g., { amount: 100, status: "completed" }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTransaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.json(updatedTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
