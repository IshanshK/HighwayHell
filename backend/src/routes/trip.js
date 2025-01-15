const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { createTrip } = require("../controllers/trip");
router.post("/createTrip", verifyToken, createTrip);
router.put()

module.exports = router;