const mongoose = require("mongoose");

// Regular expression for username validation
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_\-$]{0,49}$/;

const connectSchema = new mongoose.Schema({
  leetcode: { type: String, default: "" },
  instagram: { type: String, default: "" },
  linkedin: { type: String, default: "" },
});

const { Schema } = mongoose;
const NotificationSchema = new Schema({
  title: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  actionLink: String, // Link to perform the action, e.g., accept friend request
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      validate: {
        validator: function (v) {
          return usernameRegex.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid username. It must start with a letter and can only contain alphanumeric characters, _ - $, with a max length of 50.`,
      },
    },
    useremail: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    profileImage: {
      type: String,
      default: "./images//default-profile.jpeg",
    },
    coverImage: {
      type: String,
      default: "./images/default-cover.jpg",
    },

    // About section
    about: {
      type: String,
    },
    connect: connectSchema,
    notifications: [NotificationSchema],
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model("User", userSchema);
