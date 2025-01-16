const express = require("express");

const { register , login } = require("../controllers/auth.js");

const router = express.Router();
router.post("/login", login);
router.post("/signup" , register);

module.exports = router;