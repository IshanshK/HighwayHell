const mongoose = require("mongoose");
//const Venue = require("../models");
//const User = require("../models");


const tripSchema = new mongoose.Schema(
  {
    tripName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    participants: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
          },
          isAdmin: {
            type: Boolean,
            default: false,
          },
          startLocation: {
            latitude: {
              type: Number,
              required: true,
            },
            longitude: {
              type: Number,
              required: true,
            },
          },
        },
      ],
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue", // Reference to the Venue model
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("Trip", tripSchema);