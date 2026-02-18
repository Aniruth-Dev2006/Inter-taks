# Razorpay Integration Guide for Next.js

## 🔐 Setting Up Razorpay

### 1. Get Your Razorpay Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. Generate keys for:
   - **Test Mode**: `rzp_test_xxxxx`
   - **Live Mode**: `rzp_live_xxxxx`

### 2. Configure Environment Variables

**For Development (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

**For Production (Vercel Dashboard):**
```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
```

### 3. Backend Configuration

In your `server` folder, add these environment variables:

```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_key_secret
```

---

## 💳 Using Razorpay in Components

### Load Razorpay Script

Add to your `src/app/layout.js`:

```javascript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

### Payment Component Example

```javascript
'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function PaymentButton({ slot, userId }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create order on backend
      const { data } = await api.post('/api/payment/create-order', {
        amount: slot.price * 100, // Amount in paise
        slotId: slot._id,
        userId: userId
      });

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Slot Booking',
        description: `Booking for ${slot.teacherName}`,
        order_id: data.orderId,
        handler: async function (response) {
          // Verify payment on backend
          const verifyData = await api.post('/api/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            slotId: slot._id,
            userId: userId
          });
          
          if (verifyData.data.success) {
            alert('Payment successful! Slot booked.');
            // Refresh bookings
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#0066ff'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Processing...' : `Pay ₹${slot.price}`}
    </button>
  );
}
```

---

## 🔧 Backend API Routes

### Create Order Endpoint (`server/routes/payment.js`)

```javascript
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, slotId, userId } = req.body;

    const options = {
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: `slot_${slotId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      slotId,
      userId
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is valid, create booking
      const booking = await Booking.create({
        user: userId,
        slot: slotId,
        status: 'confirmed',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });

      res.json({ success: true, booking });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 📋 Checklist for Production

- [ ] Get live Razorpay API keys
- [ ] Add keys to Vercel environment variables
- [ ] Add keys to backend environment variables
- [ ] Test payment in test mode first
- [ ] Verify webhook handling (optional)
- [ ] Enable required payment methods in Razorpay Dashboard
- [ ] Set up payment failure handling
- [ ] Add payment success/failure pages
- [ ] Test refund flow (if needed)

---

## 🎨 Customization

### Custom Checkout UI
You can customize the Razorpay checkout modal:

```javascript
const options = {
  // ... other options
  theme: {
    color: '#0066ff',        // Your brand color
    backdrop_color: '#000000' // Background overlay color
  },
  modal: {
    ondismiss: function() {
      alert('Payment cancelled');
    }
  }
};
```

### Custom Success/Failure Handling

```javascript
handler: function (response) {
  // Success
  router.push(`/booking/success?payment_id=${response.razorpay_payment_id}`);
},
modal: {
  ondismiss: function() {
    // User closed the modal
    router.push('/booking/cancelled');
  }
}
```

---

## 🧪 Testing

### Test Cards
Use these test cards in **Test Mode**:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`

**Razorpay Test Mode:**
- All test payments are free
- No money is actually charged
- Use test API keys (`rzp_test_xxxxx`)

---

## 🔒 Security Best Practices

1. **Never expose key_secret on frontend**
   - Only use `RAZORPAY_KEY_ID` on frontend
   - Keep `RAZORPAY_KEY_SECRET` on backend only

2. **Always verify payment on backend**
   - Don't trust frontend responses
   - Verify signature using crypto library

3. **Use environment variables**
   - Never hardcode API keys
   - Different keys for dev/prod

4. **HTTPS in production**
   - Razorpay requires HTTPS
   - Vercel provides this automatically

---

## 📞 Support

- [Razorpay Docs](https://razorpay.com/docs)
- [Integration Guide](https://razorpay.com/docs/payment-gateway/web-integration/)
- [API Reference](https://razorpay.com/docs/api/)

---

## 💡 Pro Tips

1. **Webhooks**: Set up webhooks for real-time payment updates
2. **Retry Logic**: Implement retry for failed payments
3. **Invoice Generation**: Generate PDF invoices after successful payment
4. **Email Notifications**: Send confirmation emails
5. **Analytics**: Track payment success/failure rates

---

**You're all set to accept payments with Razorpay! 🎉**
