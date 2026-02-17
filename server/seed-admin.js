const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/slot-booking";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    
    if (existingAdmin) {
      console.log("❌ Admin already exists!");
      console.log("Email: admin@example.com");
      process.exit(0);
    }

    // Create Admin User
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🔐 Admin Credentials:");
    console.log("   Email:    admin@example.com");
    console.log("   Password: password123");
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
