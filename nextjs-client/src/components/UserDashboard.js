'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import styles from './UserDashboard.module.css';

export default function UserDashboard({ user }) {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [toast, setToast] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    fetchSlots(true);
    fetchBookings();
    
    const interval = setInterval(() => {
      fetchSlots(false);
      fetchBookings();
    }, 30000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSlots = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get('/api/slots');
      setSlots(response.data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get(`/api/bookings/my-bookings/${user.id}`);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleBookSlot = async (slot) => {
    if (!razorpayLoaded) {
      setToast({ message: 'Payment system loading. Please try again.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      
      // Create Razorpay order
      const orderResponse = await api.post('/api/payment/create-order', {
        slotId: slot._id,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'SlotBook',
        description: `${slot.teacherName} - ${slot.subject}`,
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/api/payment/verify-payment', {
              slotId: slot._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            setToast({ message: 'Payment successful! Slot booked.', type: 'success' });
            
            // Download invoice
            try {
              const invoiceResponse = await api.get(
                `/api/payment/invoice/${verifyResponse.data.booking._id}`,
                { responseType: 'blob' }
              );
              
              const url = window.URL.createObjectURL(new Blob([invoiceResponse.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `invoice-${verifyResponse.data.booking._id}.pdf`);
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (err) {
              console.error('Invoice download error:', err);
            }

            fetchSlots(false);
            fetchBookings();
            setLoading(false);
          } catch (err) {
            console.error('Payment verification error:', err);
            setToast({ 
              message: err.response?.data?.message || 'Payment verification failed', 
              type: 'error' 
            });
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#0066ff',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setToast({ message: 'Payment cancelled', type: 'error' });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (err) {
      console.error('Payment error:', err);
      setToast({ 
        message: err.response?.data?.message || 'Error initiating payment', 
        type: 'error' 
      });
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await api.delete(`/api/bookings/${bookingId}/${user.id}`);
      setToast({ message: 'Booking cancelled successfully!', type: 'success' });
      fetchBookings();
      fetchSlots(false);
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || 'Error cancelling booking', 
        type: 'error' 
      });
    }
  };

  const availableSlots = slots.filter(slot => 
    slot.availableSeats > 0 && !slot.bookedBy?.some(id => id === user.id)
  );

  return (
    <div className={styles.dashboard}>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {toast.type === 'success' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            )}
          </svg>
          {toast.message}
          <button onClick={() => setToast(null)}>&times;</button>
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1>Book Your Slots</h1>
          <p>Find and book specialist consultation slots</p>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'available' ? styles.active : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            Available Slots <span className="badge badge-info">{availableSlots.length}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'bookings' ? styles.active : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            My Bookings <span className="badge badge-success">{bookings.length}</span>
          </button>
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'available' ? (
          <div className={styles.slotsGrid}>
            {loading ? (
              <div className={styles.loadingState}>
                <div className="spinner"></div>
                <p>Loading slots...</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                <p>No available slots at the moment</p>
              </div>
            ) : (
              availableSlots.map(slot => (
                <div key={slot._id} className={`card ${styles.slotCard}`}>
                  <div className={styles.slotHeader}>
                    <h3>{slot.teacherName}</h3>
                    <span className="badge badge-info">{slot.subject}</span>
                  </div>
                  <div className={styles.slotDetails}>
                    <div className={styles.detailRow}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                      <span>{slot.date}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                      <span>{slot.availableSeats}/{slot.capacity} seats available</span>
                    </div>
                    {slot.description && (
                      <p className={styles.description}>{slot.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleBookSlot(slot)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Book Slot - ₹{slot.price || 500}
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className={styles.bookingsContainer}>
            {bookings.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
                <p>You haven&apos;t booked any slots yet</p>
              </div>
            ) : (
              <div className={styles.bookingsList}>
                {bookings.filter(b => b.status === 'confirmed').map(booking => (
                  <div key={booking._id} className={`card ${styles.bookingCard}`}>
                    <div className={styles.bookingHeader}>
                      <div>
                        <h3>{booking.slot?.teacherName}</h3>
                        <span className="badge badge-success">Confirmed</span>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className={styles.bookingDetails}>
                      <div className={styles.detailRow}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                        </svg>
                        <span>{booking.slot?.date}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        <span>{booking.slot?.startTime} - {booking.slot?.endTime}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                        </svg>
                        <span>₹{booking.slot?.price || 500}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
