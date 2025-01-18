const axios = require('axios');
const Trip = require("../models/Trip");
const User = require("../models/User");
const Venue = require("../models/Venue"); 
require("dotenv").config();
const API_KEY = process.env.API_KEY; 

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
const acceptTrip = async (req, res) => {
  try {
    const { tripId, startLocation } = req.body; 
    const userId = req.user.id; 
    const { latitude, longitude } = startLocation;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const isAlreadyParticipant = trip.participants.some(
      (participant) => participant.userId.toString() === userId
    );

    if (isAlreadyParticipant) {
      return res.status(400).json({ message: "User is already a participant in this trip" });
    }

    const newParticipant = {
      userId: userId,
      isAdmin: false,
      startLocation: {
        latitude: latitude,
        longitude: longitude,
      },
    };

    trip.participants.push(newParticipant); // Add the participant to the trip
    await trip.save(); // Save the updated trip

    res.status(200).json({ message: "Trip invite accepted successfully", trip });
  } catch (error) {
    res.status(500).json({ message: "Error accepting trip invite", error: error.message });
  }
};

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
      places = places.filter(place => place.rating && place.rating >= 4);
    }

    res.status(200).json({
      message: 'Nearby venues fetched successfully',
      venues: places,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venues', error: error.message });
  }
};


const saveDestination = async (req, res) => {
  try {
    const {
      tripId,
      business_status,
      geometry: { location },
      icon,
      icon_background_color,
      icon_mask_base_uri,
      name,
      opening_hours,
      photos,
      place_id,
      plus_code,
      price_level,
      rating,
      reference,
      scope,
      types,
      user_ratings_total,
      vicinity
    } = req.body;

    // Check for required fields
    if (!place_id || !name || !location.lat || !location.lng) {
      return res.status(400).json({ message: "Missing required fields." });
    }


    const venue = new Venue({
      businessStatus: business_status,
      geometry: {
        location: {
          latitude: location.lat,
          longitude: location.lng,
        },
      },
      icon,
      iconBackgroundColor: icon_background_color,
      iconMaskBaseUri: icon_mask_base_uri,
      name,
      openingHours: {
        openNow: opening_hours?.open_now,
      },
      photos: photos?.map((photo) => ({
        height: photo.height,
        htmlAttributions: photo.html_attributions,
        photoReference: photo.photo_reference,
        width: photo.width,
      })),
      venueId: place_id,
      plusCode: {
        compoundCode: plus_code?.compound_code,
        globalCode: plus_code?.global_code,
      },
      priceLevel: price_level,
      rating,
      reference,
      scope,
      types,
      userRatingsTotal: user_ratings_total,
      vicinity,
    });

    await venue.save();
    // Update the trip with the reference to the venue
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }
    trip.venue = venue._id;
    await trip.save();

    res.status(201).json({
      message: "Venue saved and linked to trip successfully.",
      venue,
      trip,
    });
  } 


   catch (error) {
    res.status(500).json({ message: "Error saving venue data.", error: error.message });
  }
};




module.exports = {
  createTrip,
  acceptTrip,
  fetchNearbyVenues,
  saveDestination
};
