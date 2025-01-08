import express from "express";
import connectDB from "./db/db.js"; // Import the database connection file
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
