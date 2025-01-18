const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
    {
      businessStatus: {
        type: String,
        enum: ["OPERATIONAL", "CLOSED_TEMPORARILY", "CLOSED_PERMANENTLY"],
      },
      geometry: {
        location: {
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
      icon: {
        type: String,
      },
      iconBackgroundColor: {
        type: String,
      },
      iconMaskBaseUri: {
        type: String,
      },
      name: {
        type: String,
        required: true,
      },
      openingHours: {
        openNow: {
          type: Boolean,
        },
      },
      photos: [
        {
          height: Number,
          htmlAttributions: [String],
          photoReference: String,
          width: Number,
        },
      ],
      venueId: {
        type: String,
        required: true,
      },
      plusCode: {
        compoundCode: String,
        globalCode: String,
      },
      priceLevel: {
        type: Number,
      },
      rating: {
        type: Number,
      },
      reference: {
        type: String,
      },
      scope: {
        type: String,
      },
      types: [String],
      userRatingsTotal: {
        type: Number,
      },
      vicinity: {
        type: String,
      },
    },
    { timestamps: true }
  );

module.exports = mongoose.model("Venue", venueSchema);