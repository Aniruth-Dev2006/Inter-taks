const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/slot-booking";

mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/slots", require("./routes/slots"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/payment", require("./routes/payment"));

app.get("/", function(req, res) {
  res.send("Slot Booking System API is running");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});