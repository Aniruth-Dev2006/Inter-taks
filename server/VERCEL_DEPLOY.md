# Vercel Deployment Guide for Backend

## Before Deploying:

1. **Update Environment Variables in Vercel Dashboard:**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `SESSION_SECRET` - Strong random string
   - `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
   - `GOOGLE_CALLBACK_URL` - `https://your-backend-url.vercel.app/api/auth/google/callback`
   - `RAZORPAY_KEY_ID` - Your Razorpay test/live key
   - `RAZORPAY_KEY_SECRET` - Your Razorpay secret
   - `CLIENT_URL` - Your frontend Vercel URL
   - `NODE_ENV` - `production`

2. **Update Google OAuth Redirect URIs:**
   - Go to Google Cloud Console
   - Update authorized redirect URIs:
     - `https://your-backend-url.vercel.app/api/auth/google/callback`

3. **Deploy:**
   ```bash
   vercel
   ```

## ⚠️ Known Limitations:

**Sessions on Vercel:**
- Express sessions with default MemoryStore won't persist across serverless function invocations
- Users may get logged out between requests
- **Solution:** Consider using JWT tokens instead of sessions for production

**Recommended for Production:**
- Use JWT authentication instead of sessions
- Store JWT in httpOnly cookies or Authorization headers
- This will work better with Vercel's serverless architecture

## Testing After Deployment:

1. Test registration: `POST /api/auth/register`
2. Test login: `POST /api/auth/login`
3. Test Google OAuth: Visit `/api/auth/google`
4. Check MongoDB Atlas - verify connections in Network Access tab
