const mongoose = require("mongoose");
require("dotenv").config();
let MONGO_URL = `${process.env.MONGO_URI}`;
// Connecting to database

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_URL);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
