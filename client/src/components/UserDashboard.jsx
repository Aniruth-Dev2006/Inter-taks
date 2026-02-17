import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import PaymentModal from './PaymentModal';
import Toast from './Toast';
import '../styles/UserDashboard.css';

function UserDashboard({ user }) {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSlots();
    fetchBookings();
    
    // Auto-refresh every 5 seconds to keep data synchronized
    const interval = setInterval(() => {
      fetchSlots();
      fetchBookings();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [user.id]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/slots`);
      setSlots(response.data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/my-bookings/${user.id}`);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedSlot(null);
    setToast({ message: 'Slot booked successfully! Invoice downloaded.', type: 'success' });
    fetchSlots();
    fetchBookings();
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`${API_URL}/api/bookings/${bookingId}/${user.id}`);
      setToast({ message: 'Booking cancelled successfully!', type: 'success' });
      fetchBookings();
      fetchSlots();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error cancelling booking', type: 'error' });
    }
  };

  const availableSlots = slots.filter(slot => 
    slot.availableSeats > 0 && !slot.bookedBy.some(id => id === user.id)
  );

  return (
    <div className="user-dashboard">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="dashboard-header">
        <h2>Book Your Slots</h2>
        <p>Find and book teacher consultation slots</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available Slots ({availableSlots.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings ({bookings.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'available' && (
          <div className="slots-grid">
            {loading ? (
              <p className="loading">Loading slots...</p>
            ) : availableSlots.length === 0 ? (
              <p className="empty-state">No available slots at the moment</p>
            ) : (
              availableSlots.map(slot => (
                <div key={slot._id} className="slot-card">
                  <div className="slot-header">
                    <h3>{slot.teacherName}</h3>
                    <span className="subject-badge">{slot.subject}</span>
                  </div>
                  <div className="slot-details">
                    <p><strong>📅 Date:</strong> {slot.date}</p>
                    <p><strong>⏰ Time:</strong> {slot.startTime} - {slot.endTime}</p>
                    <p><strong>👥 Available Seats:</strong> {slot.availableSeats}/{slot.capacity}</p>
                    {slot.description && (
                      <p><strong>📝 Description:</strong> {slot.description}</p>
                    )}
                  </div>
                  <button
                    className="book-btn"
                    onClick={() => handleBookSlot(slot)}
                  >
                    Book Slot - ₹{slot.price || 50}.00
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-container">
            {bookings.length === 0 ? (
              <p className="empty-state">You haven't booked any slots yet</p>
            ) : (
              <div className="bookings-list">
                {bookings.filter(b => b.status === 'confirmed').map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-header">
                      <h3>{booking.teacherName}</h3>
                      <span className="status-badge">Confirmed</span>
                    </div>
                    <div className="booking-details">
                      <p><strong>📚 Subject:</strong> {booking.subject}</p>
                      <p><strong>📅 Date:</strong> {booking.date}</p>
                      <p><strong>⏰ Time:</strong> {booking.startTime} - {booking.endTime}</p>
                      <p><strong>🔖 Booking ID:</strong> {booking._id.substring(0, 8)}</p>
                    </div>
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showPaymentModal && selectedSlot && (
        <PaymentModal
          slot={selectedSlot}
          user={user}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedSlot(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default UserDashboard;
