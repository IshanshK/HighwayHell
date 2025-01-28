const express = require("express");
const connectDB = require("./db/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.js");
const tripRoutes = require("./routes/trip.js");
const chatRoutes = require("./routes/chat.js");
const messageRoutes = require("./routes/message.js");
var cors = require("cors");
//const userRoutes = require("./routes/users.js");
//const User = require("./models/User.js");


// Load environment variables
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/trip", tripRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//app.use("/users", userRoutes);


// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
