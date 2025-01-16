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
    if (!user) return res.status(400).json({ msg: "User does not exist. " });
    const [salt, storedHash] = user.password.split(":");

    // Hash the provided password with the same salt

    const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
    // const passwordHash = await hashPassword(password, salt);

    if (passwordHash !== storedHash) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
    register,
    login
}