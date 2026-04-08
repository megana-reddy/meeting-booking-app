import React, { useState, useEffect } from 'react';

function App() {
  const apiBase = 'https://meeting-booking-app-fbpt.onrender.com';
  const roomOptions = ['Room A', 'Room B', 'Room C'];
  const [bookings, setBookings] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = React.useRef(null);
  const userInitials = 'MR'; // Megana Reddy

  useEffect(() => {
    fetchBookings();
    
    // Update date every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    alert('Logout clicked!');
    setProfileDropdownOpen(false);
  };

  const handleProfile = () => {
    alert('Profile clicked!');
    setProfileDropdownOpen(false);
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${apiBase}/bookings`);
      if (!response.ok) {
        throw new Error('Failed to load bookings');
      }
      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiBase}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Booking failed');
      }

      setRoomId('');
      setStartTime('');
      setEndTime('');
      setSuccess('Booking added successfully');
      await fetchBookings();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern SaaS Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 via-blue-650 to-indigo-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left Section - Title and Subtitle */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-wide hover:text-blue-100 transition duration-300 cursor-pointer">
                Meeting Room Booking
              </h1>
              <p className="text-blue-100 text-sm mt-1 opacity-90">
                Manage your conference rooms efficiently
              </p>
            </div>

            {/* Right Section - Date/Time and Profile */}
            <div className="flex items-center gap-6 ml-8">
              {/* Date and Time */}
              <div className="hidden md:block text-right">
                <p className="text-blue-100 text-sm opacity-90">
                  {currentDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-blue-50 text-xs font-semibold">
                  {currentDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 transition duration-200 cursor-pointer shadow-md hover:shadow-lg font-bold text-white text-sm"
                  title="Profile"
                >
                  {userInitials}
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* Dropdown Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">Megana Reddy</p>
                      <p className="text-xs text-gray-500 mt-1">megana@example.com</p>
                    </div>

                    {/* Dropdown Items */}
                    <button
                      onClick={handleProfile}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition duration-150 flex items-center gap-2"
                    >
                      <span>👤</span> Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150 flex items-center gap-2 border-t border-gray-100 mt-1"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 max-w-6xl">
        {/* Booking Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a Room</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Room Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Room</label>
                <select
                  value={roomId}
                  onChange={e => setRoomId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                >
                  <option value="">Choose a room...</option>
                  {roomOptions.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 rounded-xl text-white font-semibold transition duration-200 ease-in-out transform ${
                    loading
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
                  }`}
                >
                  {loading ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-red-800 font-semibold text-sm">⚠️ Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mt-6 rounded-lg bg-green-50 p-4 border border-green-200">
                <p className="text-green-800 font-semibold text-sm">✅ Success</p>
                <p className="text-green-700 text-sm mt-1">{success}</p>
              </div>
            )}
          </form>
        </div>

        {/* Bookings Table Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Bookings</h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg font-medium">No bookings yet</p>
              <p className="text-gray-300 text-sm mt-2">Start by creating a new booking above</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Room</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      className={`border-b border-gray-100 transition duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50 cursor-pointer`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{booking.roomId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.startTime).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.endTime).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(booking.bookedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;