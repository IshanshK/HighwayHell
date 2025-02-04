const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");
const { calculateMidpoint } = require("../middlewares/trip");
const {
  createTrip,
  acceptTrip,
  fetchNearbyVenues,
  saveDestination,
  searchUsers,
  sendTripRequest,
  getNotifications,
  denyTrip,
  saveUserLocation,
} = require("../controllers/trip");
router.post("/createTrip", verifyToken, createTrip);
router.post("/decideVenue", verifyToken, calculateMidpoint, fetchNearbyVenues);
router.post("/selectVenue", verifyToken, saveDestination);
router.get("/search-users", verifyToken, searchUsers);
router.post("/sendTripRequest", verifyToken, sendTripRequest);
router.get("/getNotifications", verifyToken, getNotifications);
router.post("/acceptTrip/:id/", verifyToken, acceptTrip);
router.post("/denyTrip/:id/", verifyToken, denyTrip);
router.post("/saveUserLocation", verifyToken, saveUserLocation);

module.exports = router;
