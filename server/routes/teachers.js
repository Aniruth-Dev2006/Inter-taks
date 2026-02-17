const express = require("express");
const Teacher = require("../models/Teacher");
const { adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create teacher (Admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, subject, department, email } = req.body;

    if (!name || !subject || !department || !email) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Check if teacher exists
    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    teacher = new Teacher({
      name,
      subject,
      department,
      email,
      createdBy: req.user._id,
    });

    await teacher.save();

    res.status(201).json({
      message: "Teacher created successfully",
      teacher,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update teacher (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { name, subject, department, email } = req.body;

    let teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.name = name || teacher.name;
    teacher.subject = subject || teacher.subject;
    teacher.department = department || teacher.department;
    teacher.email = email || teacher.email;

    await teacher.save();

    res.json({
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete teacher (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
