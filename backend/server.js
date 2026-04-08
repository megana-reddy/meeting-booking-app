const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fixed list of rooms
const rooms = ['Room A', 'Room B', 'Room C'];

// Middleware
const corsOptions = {
  origin: [
    'https://meeting-booking-app-one.vercel.app',
    'http://localhost:3000',
    'localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.error('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
});

// Route aliases
app.use(['/bookings', '/api/bookings'], require('./routes/bookings'));

// Static rooms endpoint
app.get(['/rooms', '/api/rooms'], (req, res) => {
  res.json(rooms.map(name => ({ _id: name, name })));
});

app.get('/', (req, res) => {
  res.send('Meeting Room Booking API');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});