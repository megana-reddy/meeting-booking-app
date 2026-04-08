const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for bookings
let bookings = [];

// Routes
app.get('/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/bookings', (req, res) => {
  const { room, startTime, endTime } = req.body;
  const newBooking = {
    id: bookings.length + 1,
    room,
    startTime,
    endTime,
    bookedAt: new Date(),
  };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});