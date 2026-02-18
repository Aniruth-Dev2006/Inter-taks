const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// OAuth removed - session and passport no longer needed
// const session = require("express-session");
// const passport = require("./config/passport");
require("dotenv").config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://client-one-tau-24.vercel.app',
  'https://client-lhte9ajba-aniruths-projects-6073edd4.vercel.app',
  'https://client-mfhc8gji2-aniruths-projects-6073edd4.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// OAuth removed - session and passport middleware no longer needed
// Session middleware
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "your-secret-key",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: false, // Set to true in production with HTTPS
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

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

// For Vercel serverless functions
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
  });
}