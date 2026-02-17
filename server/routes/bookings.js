const express = require("express");
const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Get all bookings (for admin stats)
router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "confirmed" })
      .populate("user", "name email")
      .populate("teacher", "name subject")
      .populate("slot", "date startTime endTime");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Book a slot
router.post("/", auth, async (req, res) => {
  try {
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: "Slot ID is required" });
    }

    const slot = await Slot.findById(slotId).populate("teacher");
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check if user already booked this slot
    if (slot.bookedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already booked this slot" });
    }

    // Check if slot has available seats
    if (slot.availableSeats <= 0) {
      return res.status(400).json({ message: "Slot is fully booked" });
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      slot: slotId,
      teacher: slot.teacher._id,
      teacherName: slot.teacherName,
      subject: slot.subject,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    await booking.save();

    // Update slot
    slot.bookedBy.push(req.user._id);
    slot.availableSeats -= 1;
    await slot.save();

    res.status(201).json({
      message: "Slot booked successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user's bookings
router.get("/my-bookings/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      user: req.params.userId,
      status: { $ne: 'cancelled' } // Exclude cancelled bookings
    })
      .populate("teacher", "name subject department")
      .populate("slot");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Cancel booking
router.delete("/:id/:userId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.params.userId) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // Update slot availability
    const slot = await Slot.findById(booking.slot);
    if (slot) {
      slot.bookedBy = slot.bookedBy.filter(id => id.toString() !== req.params.userId);
      slot.availableSeats += 1;
      await slot.save();
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all bookings for slot
router.get("/slot/:slotId", async (req, res) => {
  try {
    const bookings = await Booking.find({ slot: req.params.slotId })
      .populate("user", "name email");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
