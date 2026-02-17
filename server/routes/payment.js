const express = require("express");
const PDFDocument = require("pdfkit");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post("/create-order", auth, async (req, res) => {
  try {
    console.log("Create order - User:", req.user.email);
    
    const { slotId } = req.body;

    // Get slot details
    const slot = await Slot.findById(slotId).populate("teacher");
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check availability
    if (slot.availableSeats <= 0) {
      return res.status(400).json({ message: "Slot is fully booked" });
    }

    if (slot.bookedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already booked this slot" });
    }

    // Create order with Razorpay
    const amountInPaise = (slot.price || 50) * 100; // Convert rupees to paise
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        slotId: slot._id.toString(),
        userId: req.user._id.toString(),
        teacherName: slot.teacherName,
        date: slot.date,
        price: slot.price || 50,
      }
    };

    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order.id);
    
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
});

// Verify Razorpay payment
router.post("/verify-payment", auth, async (req, res) => {
  try {
    console.log("Verify payment - User:", req.user.email);
    
    const { slotId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    console.log("Payment verified successfully");

    // Get slot details
    const slot = await Slot.findById(slotId).populate("teacher");
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check availability
    if (slot.availableSeats <= 0) {
      return res.status(400).json({ message: "Slot is fully booked" });
    }

    if (slot.bookedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already booked this slot" });
    }

    const transactionId = razorpay_payment_id;
    
    // Create booking with actual slot price
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
      paymentIntentId: transactionId,
      amountPaid: slot.price || 50,
    });

    await booking.save();

    // Update slot
    slot.bookedBy.push(req.user._id);
    slot.availableSeats -= 1;
    await slot.save();

    res.json({
      message: "Payment verified and booking confirmed",
      booking,
      transactionId,
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
});

// Confirm booking after payment
router.post("/confirm-booking", auth, async (req, res) => {
  try {
    const { transactionId, slotId } = req.body;

    // In production, verify transaction with payment gateway
    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID required" });
    }

    // Get booking by transaction ID
    const booking = await Booking.findOne({ paymentIntentId: transactionId });
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (err) {
    console.error("Booking confirmation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Generate PDF invoice
router.get("/invoice/:bookingId", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("user")
      .populate("teacher")
      .populate("slot");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${booking._id}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add content
    doc.fontSize(20).text("SLOT BOOKING INVOICE", { align: "center" });
    doc.moveDown();
    
    // Add violet line
    doc.strokeColor("#7c3aed").lineWidth(2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Invoice details
    doc.fontSize(12).fillColor("#000000");
    doc.text(`Invoice ID: ${booking._id}`, { align: "left" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "left" });
    doc.text(`Payment Status: ${booking.status.toUpperCase()}`, { align: "left" });
    doc.moveDown();

    // Customer details
    doc.fontSize(14).fillColor("#7c3aed").text("Customer Details:", { underline: true });
    doc.fontSize(12).fillColor("#000000");
    doc.text(`Name: ${booking.userName}`);
    doc.text(`Email: ${booking.userEmail}`);
    doc.moveDown();

    // Booking details
    doc.fontSize(14).fillColor("#7c3aed").text("Booking Details:", { underline: true });
    doc.fontSize(12).fillColor("#000000");
    doc.text(`Teacher: ${booking.teacherName}`);
    doc.text(`Subject: ${booking.subject}`);
    doc.text(`Date: ${booking.date}`);
    doc.text(`Time: ${booking.startTime} - ${booking.endTime}`);
    doc.moveDown();

    // Payment details
    doc.fontSize(14).fillColor("#7c3aed").text("Payment Details:", { underline: true });
    doc.fontSize(12).fillColor("#000000");
    doc.text(`Amount Paid: ₹${booking.amountPaid?.toFixed(2) || "50.00"}`);
    doc.text(`Payment Method: Razorpay (Card)`);
    if (booking.paymentIntentId) {
      doc.text(`Transaction ID: ${booking.paymentIntentId}`);
    }
    doc.moveDown(2);

    // Footer
    doc.strokeColor("#7c3aed").lineWidth(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.fontSize(10).fillColor("#666666")
      .text("Thank you for your booking!", { align: "center" })
      .text("For any queries, contact support@slotbooking.com", { align: "center" });

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error("Invoice generation error:", err);
    res.status(500).json({ message: "Error generating invoice", error: err.message });
  }
});

module.exports = router;
