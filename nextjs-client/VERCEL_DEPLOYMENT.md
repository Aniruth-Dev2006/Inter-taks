# Vercel Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
- GitHub account (recommended) or Vercel CLI
- Vercel account (free tier works)
- Backend API deployed and accessible

---

## 📋 Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

#### Step 1: Push to GitHub
```bash
cd nextjs-client
git init
git add .
git commit -m "Initial commit - Next.js slot booking app"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### Step 2: Connect to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Select the `nextjs-client` folder** as the root directory
5. **Configure Project**:
   - Framework Preset: **Next.js**
   - Root Directory: **nextjs-client** (if repo contains multiple folders)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

#### Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.vercel.app` | Production, Preview, Development |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_xxx` or `rzp_test_xxx` | Production, Preview, Development |

**Important**: Replace `https://your-backend.vercel.app` with your actual deployed backend URL!

#### Step 4: Deploy
Click **"Deploy"** and wait for the build to complete (~2-3 minutes)

---

### Option 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy from Project Directory
```bash
cd nextjs-client
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → N (first time)
- **Project name?** → slot-booking-nextjs
- **Directory?** → ./ (current directory)
- **Override settings?** → N

#### Step 4: Add Environment Variables
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend.vercel.app

vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID
# Enter: your_razorpay_key_id
```

#### Step 5: Deploy to Production
```bash
vercel --prod
```

---

## 🔧 Backend Deployment

Your backend (`server` folder) should also be deployed to Vercel or another hosting service.

### Deploy Backend to Vercel

1. **Separate Repository** (Recommended):
   ```bash
   cd server
   git init
   git add .
   git commit -m "Backend API"
   git push to your backend repo
   ```

2. **Import to Vercel**:
   - Create new project in Vercel
   - Import backend repository
   - Vercel will auto-detect the `vercel.json` configuration

3. **Add Backend Environment Variables**:
   - `MONGODB_URI` → Your MongoDB connection string
   - `JWT_SECRET` → Your JWT secret
   - `GOOGLE_CLIENT_ID` → Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` → Google OAuth secret
   - `RAZORPAY_KEY_SECRET` → Razorpay key secret
   - `CLIENT_URL` → Your frontend URL (e.g., `https://your-app.vercel.app`)

4. **Update CORS**:
   Make sure your backend allows your Vercel frontend URL in CORS settings.

---

## ⚙️ Post-Deployment Configuration

### 1. Update Frontend API URL

After deploying your backend, update the frontend environment variable:

**In Vercel Dashboard**:
- Go to your Next.js project
- Settings → Environment Variables
- Update `NEXT_PUBLIC_API_URL` to your deployed backend URL
- Redeploy the frontend

### 2. Update Backend CORS

In your `server/app.js`, ensure CORS includes your Vercel frontend:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://your-app-*.vercel.app' // For preview deployments
  ],
  credentials: true
}));
```

### 3. Update Google OAuth Redirect URIs

In Google Cloud Console:
- Add authorized redirect URIs:
  - `https://your-backend.vercel.app/api/auth/google/callback`
  - `https://your-app.vercel.app/auth/success`

---

## 🔍 Verify Deployment

### Check Frontend
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Landing page should load correctly
3. Check browser console for any errors

### Check API Connection
1. Go to `/auth` page
2. Try to sign in
3. Open browser Network tab to verify API calls

### Common Issues

**Issue**: API calls fail with CORS error
- **Solution**: Update CORS settings in backend to include Vercel URL

**Issue**: Environment variables not working
- **Solution**: Make sure they have `NEXT_PUBLIC_` prefix for client-side access
- **Solution**: Redeploy after adding environment variables

**Issue**: 404 on page refresh
- **Solution**: Next.js handles this automatically, but check if routing is correct

**Issue**: Build fails
- **Solution**: Check build logs in Vercel dashboard
- **Solution**: Verify all dependencies are in `package.json`

---

## 📊 Monitoring

### Vercel Analytics (Optional)
Enable analytics in Vercel dashboard for:
- Page views
- Performance metrics
- User analytics

### Real-Time Logs
View logs in Vercel Dashboard → Your Project → Logs

---

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch → Production deployment
- Every PR → Preview deployment with unique URL
- Automatic rollback if deployment fails

---

## 💰 Vercel Pricing

**Hobby Plan (Free)**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ HTTPS/SSL certificates
- ✅ Custom domains
- ✅ Great for personal projects

**Pro Plan ($20/month)**:
- Increased limits
- Team collaboration
- Analytics
- Password protection

---

## 🎯 Quick Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Backend URL added to frontend env variables
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured in Vercel
- [ ] CORS updated in backend
- [ ] Google OAuth URIs updated
- [ ] Test authentication works
- [ ] Test booking functionality
- [ ] Custom domain configured (optional)

---

## 🌐 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain (e.g., `mybooking.com`)
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (up to 24 hours)

---

## 📱 Progressive Web App (Future)

To make your app installable:
1. Add `manifest.json` to public folder
2. Add service worker
3. Enable PWA in `next.config.mjs`

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GitHub Issues**: Create an issue in your repository

---

## 🎉 Success!

Your app is now live and accessible worldwide! Share your Vercel URL with users.

Example: `https://slot-booking-nextjs.vercel.app`

---

**Pro Tips**:
- Use preview deployments to test changes before production
- Enable Vercel Analytics to track usage
- Set up monitoring/error tracking (Sentry, etc.)
- Regular backups of your database
- Keep dependencies updated

**Happy Deploying! 🚀**
