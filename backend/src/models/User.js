const mongoose =  require("mongoose");

// Regular expression for username validation
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_\-$]{0,49}$/;

const userSchema = new mongoose.Schema({
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
    match: [
      /^\S+@\S+\.\S+$/,
      "Please provide a valid email address.",
    ],
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
  dob: {
    type: Date,
    required: false,
  },
  sex: {
    type: String,
    enum: ["male", "female", "other"],
    required: false,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
}, {timestamps: true }
);

// Export the model
module.exports = mongoose.model("User", userSchema);
