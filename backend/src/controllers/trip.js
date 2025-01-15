const Trip = require("../models/Trip");
const User = require("../models/User");

const createTrip = async (req, res) => {
  try {
    const { tripName, startLocation } = req.body;

    // Check if startLocation is provided and destructure safely
    if (!startLocation || !startLocation.latitude || !startLocation.longitude) {
      return res.status(400).json({
        message: "startLocation with latitude and longitude is required",
      });
    }

    const { latitude, longitude } = startLocation;
    const userId = req.user.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new trip with the admin as the first participant
    const newTrip = new Trip({
      tripName,
      participants: [
        {
          userId: userId,
          isAdmin: true,
          startLocation: {
            latitude: latitude,
            longitude: longitude,
          }, // Ensure latitude and longitude are provided in body
        },
      ],
    });

    await newTrip.save();
    res
      .status(201)
      .json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating trip", error: error.message });
  }
};


module.exports = {
  createTrip,
};
