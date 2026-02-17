const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "No user ID provided" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication error" });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "No user ID provided" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication error" });
  }
};

module.exports = { auth, adminAuth };
