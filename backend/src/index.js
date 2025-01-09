

const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/db");


// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
