const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { calculateMidpoint } = require("../middlewares/trip");
const { createTrip , acceptTrip , fetchNearbyVenues, saveDestination} = require("../controllers/trip");
router.post("/createTrip", verifyToken, createTrip);
router.put("/acceptTrip", verifyToken, acceptTrip);
router.post("/decideVenue", verifyToken, calculateMidpoint, fetchNearbyVenues);
router.post("/selectVenue" , verifyToken , saveDestination);

module.exports = router;



