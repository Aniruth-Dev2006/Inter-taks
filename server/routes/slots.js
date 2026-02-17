const express = require("express");
const Slot = require("../models/Slot");
const { adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get all slots
router.get("/", async (req, res) => {
  try {
    const slots = await Slot.find()
      .populate("teacher", "name subject department")
      .populate("bookedBy", "name email");

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get slots by teacher
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const slots = await Slot.find({ teacher: req.params.teacherId })
      .populate("teacher", "name subject department")
      .populate("bookedBy", "name email");

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create slot (Admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { teacher, teacherName, subject, date, startTime, endTime, capacity, price, description } = req.body;

    if (!teacher || !teacherName || !subject || !date || !startTime || !endTime || !capacity) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const slot = new Slot({
      teacher,
      teacherName,
      subject,
      date,
      startTime,
      endTime,
      capacity,
      availableSeats: capacity,
      price: price || 50,
      description,
      createdBy: req.user._id,
    });

    await slot.save();
    await slot.populate("teacher", "name subject department");

    res.status(201).json({
      message: "Slot created successfully",
      slot,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update slot (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { teacherName, subject, date, startTime, endTime, capacity, price, description } = req.body;

    let slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    slot.teacherName = teacherName || slot.teacherName;
    slot.subject = subject || slot.subject;
    slot.date = date || slot.date;
    slot.startTime = startTime || slot.startTime;
    slot.endTime = endTime || slot.endTime;
    slot.description = description || slot.description;
    
    if (price !== undefined) {
      slot.price = price;
    }

    if (capacity && capacity !== slot.capacity) {
      const bookedCount = slot.bookedBy.length;
      slot.capacity = capacity;
      slot.availableSeats = capacity - bookedCount;
    }

    await slot.save();
    await slot.populate("teacher", "name subject department");

    res.json({
      message: "Slot updated successfully",
      slot,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete slot (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
