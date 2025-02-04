const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
require("dotenv").config();
//Registration
const register = async (req, res) => {
    try {
      const {
        username,
        useremail,
        name,
        password,
      } = req.body;


    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
      const newUser = new User({
        username,
        useremail,
        name,
        password: `${salt}:${passwordHash}`,
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  
/* LOGGING IN */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ useremail: email });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    // Password verification
    const [salt, storedHash] = user.password.split(":");
    const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
    if (passwordHash !== storedHash) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Get full user data with population
    const fullUser = await User.findById(user._id)
      .select("-password -createdAt -updatedAt")
      .populate({
        path: "friends",
        select: "username name profileImage"
      })
      .lean(); // Convert to plain object

    // Remove version key
    delete fullUser.__v;

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ 
      token, 
      user: fullUser 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 // Adjust the path to your User model

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated & ID is extracted from token middleware
    const { currentPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract salt and hashed password from stored password
    const [salt, storedHash] = user.password.split(":");

    // Hash the entered current password using the stored salt
    const enteredHash = crypto.scryptSync(currentPassword, salt, 64).toString("hex");

    // Compare hashes
    if (enteredHash !== storedHash) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Generate a new salt and hash the new password
    const newSalt = crypto.randomBytes(16).toString("hex");
    const newPasswordHash = crypto.scryptSync(newPassword, newSalt, 64).toString("hex");

    // Update password in the database
    user.password = `${newSalt}:${newPasswordHash}`;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = {
    register,
    login,
    changePassword
}