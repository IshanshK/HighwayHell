import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const connectDB = async () => {
  mongoose.connect("mongodb+srv://Aashish:jha@cluster0.5vwwq.mongodb.net/highwayDB");
};

export default connectDB;
