const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fixed list of rooms
const rooms = ['Room A', 'Room B', 'Room C'];

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Route aliases
app.use(['/bookings', '/api/bookings'], require('./routes/bookings'));

// Static rooms endpoint
app.get(['/rooms', '/api/rooms'], (req, res) => {
  res.json(rooms.map(name => ({ _id: name, name })));
});

app.get('/', (req, res) => {
  res.send('Meeting Room Booking API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});