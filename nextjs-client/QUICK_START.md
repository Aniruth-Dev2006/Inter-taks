# Quick Start: Deploy to Vercel

## 🚀 Already Running on Vercel?

If your app is already deployed, here's what to do:

### 1. Update Environment Variables

Go to your Vercel dashboard:
1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add/Update these variables:

```
NEXT_PUBLIC_API_URL = https://your-backend.vercel.app
NEXT_PUBLIC_RAZORPAY_KEY_ID = your_razorpay_key_id
```

### 2. Get Your Backend URL

Your backend should be deployed separately. The URL format is typically:
```
https://your-project-name.vercel.app
```

Find it in your backend project's Vercel dashboard.

### 3. Redeploy

After updating environment variables:
- Go to **Deployments** tab
- Click the **•••** menu on the latest deployment
- Select **Redeploy**

**OR** push a new commit to trigger auto-deployment:
```bash
git add .
git commit -m "Update config"
git push
```

---

## 🔧 Quick Configuration Checklist

### Frontend (Next.js Client)
- ✅ Deployed to Vercel
- ✅ Environment variables set:
  - `NEXT_PUBLIC_API_URL` → Backend URL
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID` → Razorpay key

### Backend (Server)
- ✅ Deployed to Vercel (or other platform)
- ✅ Environment variables set:
  - `MONGODB_URI` → MongoDB connection
  - `JWT_SECRET` → Secret for tokens
  - `GOOGLE_CLIENT_ID` → Google OAuth
  - `GOOGLE_CLIENT_SECRET` → Google OAuth
  - `RAZORPAY_KEY_SECRET` → Razorpay key secret
  - `CLIENT_URL` → Frontend URL

### CORS Configuration
Update in your `server/app.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-nextjs-app.vercel.app', // ← Add this
    'https://your-nextjs-app-*.vercel.app' // ← For preview deployments
  ],
  credentials: true
}));
```

---

## 🧪 Test Your Deployment

1. **Visit your app**: `https://your-app.vercel.app`
2. **Open browser console** (F12)
3. **Check for errors**
4. **Test authentication**:
   - Try email/password login
   - Try Google OAuth
5. **Test booking flow**:
   - View available slots
   - Book a slot
   - View bookings

---

## 🐛 Troubleshooting

### API Calls Not Working?

**Check Network Tab** (F12 → Network):
- Are API calls going to the correct URL?
- Status code 404? → Backend not deployed or wrong URL
- CORS error? → Update CORS settings in backend
- 401/403? → Authentication issue

**Fix**:
1. Verify `NEXT_PUBLIC_API_URL` in Vercel dashboard
2. Make sure backend is deployed and accessible
3. Update CORS in backend to include your Vercel URL
4. Redeploy both frontend and backend

### Environment Variables Not Working?

**Client-side variables** (accessible in browser):
- ✅ Must start with `NEXT_PUBLIC_`
- ✅ Example: `NEXT_PUBLIC_API_URL`
- ❌ NOT: `API_URL`

**After adding env variables**:
- Must redeploy for changes to take effect
- Click "Redeploy" in Vercel dashboard

### Google OAuth Not Working?

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client
5. Add to **Authorized redirect URIs**:
   ```
   https://your-backend.vercel.app/api/auth/google/callback
   ```
6. Add to **Authorized JavaScript origins**:
   ```
   https://your-nextjs-app.vercel.app
   ```

---

## 📈 Monitor Your App

### Vercel Dashboard
- Real-time logs
- Deployment history
- Performance metrics
- Error tracking

### Check Logs
```bash
# Install Vercel CLI
npm install -g vercel

# View logs
vercel logs YOUR_PROJECT_URL
```

---

## 🔄 Making Updates

### Quick Updates
```bash
cd nextjs-client
# Make your changes
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically:
1. Detect the push
2. Build your app
3. Deploy to production
4. Update the live site

### Preview Deployments
Every branch/PR gets a unique preview URL:
```
https://your-app-git-feature-branch.vercel.app
```

---

## 💡 Pro Tips

1. **Use Preview Deployments**:
   - Create a branch, make changes, push
   - Test on preview URL before merging to main

2. **Environment-Specific URLs**:
   ```javascript
   // Use different backend for preview/production
   const API_URL = process.env.NEXT_PUBLIC_API_URL
   ```

3. **Custom Domain**:
   - Add in Vercel Settings → Domains
   - Free SSL certificate included

4. **Monitor Performance**:
   - Enable Vercel Analytics
   - Check Core Web Vitals

---

## 🎯 Current Status Check

Run these in your browser console on your deployed site:

```javascript
// Check API URL
console.log(process.env.NEXT_PUBLIC_API_URL)

// Test API connection
fetch(process.env.NEXT_PUBLIC_API_URL + '/api/slots')
  .then(r => r.json())
  .then(d => console.log('API works:', d))
  .catch(e => console.error('API error:', e))
```

---

## 📞 Need Immediate Help?

1. **Check Vercel deployment logs** (most common issues show here)
2. **Check browser console** (F12) for frontend errors
3. **Test API directly** in browser or Postman
4. **Verify all environment variables** are set correctly
5. **Ensure backend is deployed and running**

---

## ✅ You're All Set!

Your app should now be:
- ✅ Accessible at your Vercel URL
- ✅ Connected to your backend API
- ✅ Ready for users to book slots
- ✅ Automatically deploying on git push

**Share your URL and start booking! 🎉**

For detailed deployment guide, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
