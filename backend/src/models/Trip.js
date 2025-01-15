const mongoose = require("mongoose");

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
      // default: [],
    },
    destination: {
      latitude: {
        type: Number,
        required: false,
      },
      longitude: {
        type: Number,
        required: false,
      },
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the model
module.exports = mongoose.model("Trip", tripSchema);
