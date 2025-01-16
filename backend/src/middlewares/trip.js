const Trip = require("../models/Trip");

const calculateMidpoint = async (req, res, next) => {
  try {
    const { tripId } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const participants = trip.participants;
    if (participants.length === 0) {
      return res.status(400).json({ message: "No participants to calculate midpoint" });
    }

    let totalLatitude = 0;
    let totalLongitude = 0;
    participants.forEach((participant) => {
      totalLatitude += participant.startLocation.latitude;
      totalLongitude += participant.startLocation.longitude;
    });

    const midpoint = {
      latitude: totalLatitude / participants.length,
      longitude: totalLongitude / participants.length,
    };

    req.midpoint = midpoint;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error calculating midpoint", error: error.message });
  }
};

module.exports = {
  calculateMidpoint,
};