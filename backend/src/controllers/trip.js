const axios = require("axios");
const Trip = require("../models/Trip");
const User = require("../models/User");
require("dotenv").config();
const API_KEY = process.env.API_KEY;

const createTrip = async (req, res) => {
  console.log("ish");
  try {
    const { tripName, description, startLocation, participants } = req.body;
    console.log(participants.length);
    // Check if startLocation is provided and destructure safely
    if (!startLocation || !startLocation.latitude || !startLocation.longitude) {
      return res.status(400).json({
        message: "startLocation with latitude and longitude is required",
      });
    }

    const { latitude, longitude } = startLocation;
    const userId = req.user.id; // Extract user ID from the token (middleware)

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const adminName = user.username;
    // Create the participants array with the logged-in user as admin
    const tripParticipants = [
      {
        userId: userId,
        isAdmin: true, // Set the logged-in user as admin
        startLocation: {
          latitude: latitude,
          longitude: longitude,
        },
      },
      ...participants
        .filter((participant) => participant.userId !== undefined) // Ensure userId is defined
        .map((participant) => ({
          userId: participant.userId,
          startLocation: {
            latitude: participant.startLocation?.latitude ?? latitude,
            longitude: participant.startLocation?.longitude ?? longitude,
          },
        })),
    ];

    console.log(tripParticipants);

    // Create the trip with the provided details
    const newTrip = new Trip({
      tripName,
      description, // Include description
      participants: tripParticipants, // Include all participants
    });

    const savedTrip = await newTrip.save();
    const tripId = savedTrip._id; // Get the generated trip ID

    await sendTripRequest(
      adminName,
      tripName,
      tripParticipants.slice(1),
      tripId
    );
    res.status(201).json({
      message: "Trip created successfully",
      trip: newTrip,
      tripId: tripId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating trip", error: error.message });
  }
};

// const acceptTrip = async (req, res) => {
//   try {
//     const { tripId, startLocation } = req.body;
//     const userId = req.user.id;
//     const { latitude, longitude } = startLocation;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const trip = await Trip.findById(tripId);
//     if (!trip) {
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     const isAlreadyParticipant = trip.participants.some(
//       (participant) => participant.userId.toString() === userId
//     );

//     if (isAlreadyParticipant) {
//       return res.status(400).json({ message: "User is already a participant in this trip" });
//     }

//     const newParticipant = {
//       userId: userId,
//       isAdmin: false,
//       startLocation: {
//         latitude: latitude,
//         longitude: longitude,
//       },
//     };

//     trip.participants.push(newParticipant); // Add the participant to the trip
//     await trip.save(); // Save the updated trip

//     res.status(200).json({ message: "Trip invite accepted successfully", trip });
//   } catch (error) {
//     res.status(500).json({ message: "Error accepting trip invite", error: error.message });
//   }
// };

const fetchNearbyVenues = async (req, res) => {
  try {
    const { latitude, longitude } = req.midpoint;
    const { keywords, radius, filterByRating } = req.body; // Extract search parameters
    const searchQuery = keywords || ""; // Default to an empty string if no keyword provided

    const response = await axios.get(
      "https://maps.gomaps.pro/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${latitude},${longitude}`,
          radius: radius || 15000, // Default radius to 20000 meters
          keyword: searchQuery,
          key: `${API_KEY}`, // Replace with actual API key
        },
      }
    );

    let places = response.data.results;

    if (filterByRating) {
      places = places.filter((place) => place.rating && place.rating >= 4);
    }

    res.status(200).json({
      message: "Nearby venues fetched successfully",
      venues: places,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching venues", error: error.message });
  }
};

const saveDestination = async (req, res) => {
  try {
    const { place_id, tripId } = req.body;

    // Check for required fields
    if (!place_id || !tripId) {
      return res
        .status(400)
        .json({ message: "Missing required fields: place_id or tripId." });
    }

    // Validate the trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    // Save the placeId to the trip
    trip.placeId = place_id;
    await trip.save();

    res.status(201).json({
      message: "place_id successfully saved to the trip.",
      trip,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving place_id to the trip.",
      error: error.message,
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    let users;
    if (username) {
      users = await User.find({ username: new RegExp(username, "i") });
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendTripRequest = async (adminName, tripName, participants, tripId) => {
  try {
    const notifications = participants.map((participant) => ({
      userId: participant.userId,
      title: "New Trip Request",
      message: `${adminName} has invited you to the trip "${tripName}".`,
      actionLink: `/accept-or-deny/${tripId}`, // Define route for action handling
    }));

    // Mock logic to send or store notifications
    for (const notification of notifications.slice(1)) {
      // Skip the first participant
      await User.findByIdAndUpdate(notification.userId, {
        $push: { notifications: notification },
      });
    }
  } catch (error) {
    console.error("Error sending trip requests:", error.message);
  }
};

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    const user = await User.findById(userId).select("notifications");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptTrip = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.notifications = user.notifications.filter(
      (notif) => notif._id.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: "Notification accepted and removed" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const denyTrip = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notification = user.notifications.find(
      (notif) => notif._id.toString() === req.params.id
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    const tripId = notification.actionLink.split("/").pop();
    if (tripId) {
      const trip = await Trip.findById(tripId);
      if (trip) {
        trip.participants = trip.participants.filter(
          (participant) => participant.userId.toString() !== req.user.id
        );
        await trip.save();
      }
    }

    user.notifications = user.notifications.filter(
      (notif) => notif._id.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: "Notification denied and removed from trip" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveUserLocation = async (req, res) => {
  try {
    console.log(3286);
    const { tripId, latitude, longitude } = req.body;
    const userId = req.user.id; // Get user ID from authentication

    // Find the trip by ID
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Find the participant in the trip and update their location
    const participant = trip.participants.find(
      (p) => p.userId.toString() === userId
    );
    if (!participant)
      return res.status(404).json({ message: "User not part of this trip" });

    // const  l1 = "69.69";
    // const  l2 = "96.96";

    // console.log(l1);
    participant.startLocation = { latitude: latitude, longitude: longitude };

    await trip.save(); // Save the updated trip

    res.status(200).json({ message: "User location updated in trip", trip });
  } catch (error) {
    console.error("Error saving location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTrip,
  acceptTrip,
  denyTrip,
  fetchNearbyVenues,
  saveDestination,
  searchUsers,
  sendTripRequest,
  getNotifications,
  saveUserLocation,
};
