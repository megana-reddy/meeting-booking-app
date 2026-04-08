const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a booking
router.post('/', async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    if (!roomId || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields: roomId, startTime, endTime" });
    }

    // Check for overlapping bookings
    const overlap = await Booking.findOne({
      roomId,
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    });

    if (overlap) {
      return res.status(400).json({ message: "Room already booked for this time slot" });
    }

    const booking = new Booking({
      roomId,
      startTime,
      endTime,
    });

    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    console.error('POST /bookings error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

module.exports = router;