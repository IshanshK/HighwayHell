const express = require("express");
const connectDB = require("./db/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.js");
const tripRoutes = require("./routes/trip.js");
//const userRoutes = require("./routes/users.js");
//const User = require("./models/User.js");
const { register } = require("./controllers/auth.js");
const { verifyToken } = require("./middlewares/auth.js");

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/trip", tripRoutes);
//app.use("/users", userRoutes);


// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
