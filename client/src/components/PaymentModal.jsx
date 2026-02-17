import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import '../styles/PaymentModal.css';

function PaymentModal({ slot, user, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRazorpayPayment = async () => {
    setError('');
    setLoading(true);

    try {
      // Create order
      const orderResponse = await axios.post(
        `${API_URL}/api/payment/create-order`,
        { slotId: slot._id },
        { headers: { 'x-user-id': user.id } }
      );

      const options = {
        key: orderResponse.data.key_id,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Slot Booking System',
        description: `${slot.teacherName} - ${slot.subject}`,
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              `${API_URL}/api/payment/verify-payment`,
              {
                slotId: slot._id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { 'x-user-id': user.id } }
            );

            // Download invoice
            const invoiceResponse = await axios.get(
              `${API_URL}/api/payment/invoice/${verifyResponse.data.booking._id}`,
              {
                headers: { 'x-user-id': user.id },
                responseType: 'blob',
              }
            );

            const url = window.URL.createObjectURL(new Blob([invoiceResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${verifyResponse.data.booking._id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setLoading(false);
            onSuccess();
          } catch (err) {
            console.error('Payment verification error:', err);
            setError(err.response?.data?.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#7c3aed',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        
        <h2>Complete Payment</h2>
        <div className="booking-summary">
          <h3>Booking Details</h3>
          <p><strong>Teacher:</strong> {slot.teacherName}</p>
          <p><strong>Subject:</strong> {slot.subject}</p>
          <p><strong>Date:</strong> {slot.date}</p>
          <p><strong>Time:</strong> {slot.startTime} - {slot.endTime}</p>
          <div className="amount">
            <strong>Amount to Pay:</strong> <span className="price">₹{slot.price || 50}.00</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="payment-options">
          <div className="test-mode-banner">
            🧪 TEST MODE - Razorpay Test Payment Gateway
          </div>

          <button 
            onClick={handleRazorpayPayment} 
            className="pay-button"
            disabled={loading}
          >
            {loading ? 'Processing Payment...' : `Pay with Razorpay ₹${slot.price || 50}.00`}
          </button>

          <div className="payment-info">
            <p>✓ Test mode - Use test cards</p>
            <p>✓ Card: 4100 2800 0000 1007</p>
            <p>✓ Any future CVV and expiry</p>
          </div>
        </div>

        <div className="secure-badge">
          🔒 Secured by Razorpay
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
