# Migration Guide: React+Vite to Next.js

## Overview
This guide helps you transition from the old React+Vite application to the new Next.js professional edition.

## Quick Start

### 1. Install Dependencies
```bash
cd nextjs-client
npm install
```

### 2. Configure Environment
Copy your API URL to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

## Key Changes

### File Structure Changes

| Old (React+Vite) | New (Next.js) |
|------------------|---------------|
| `client/src/App.jsx` | `nextjs-client/src/app/page.js` |
| `client/src/components/AuthPage.jsx` | `nextjs-client/src/app/auth/page.js` |
| `client/src/components/AdminDashboard.jsx` | `nextjs-client/src/components/AdminDashboard.js` |
| `client/src/components/UserDashboard.jsx` | `nextjs-client/src/components/UserDashboard.js` |
| `client/src/global.css` | `nextjs-client/src/styles/globals.css` |

### Import Changes

**Old way (Vite):**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import API_URL from '../config/api';
```

**New way (Next.js):**
```jsx
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
```

### Routing Changes

**Old way (React Router):**
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<AuthPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
```

**New way (Next.js):**
- Create files in `src/app/` directory
- `src/app/page.js` → `/`
- `src/app/dashboard/page.js` → `/dashboard`
- `src/app/auth/page.js` → `/auth`

### Navigation Changes

**Old way:**
```jsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/dashboard');
```

**New way:**
```jsx
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/dashboard');
```

### Styling Changes

**Old Theme:**
- Dark background with purple/violet glow
- Glow effects on buttons and cards
- Dark color scheme

**New Theme:**
- Light, professional appearance
- Blue and teal accent colors
- Clean, modern design
- Enterprise-level aesthetics

### CSS Organization

**Old:**
- Separate CSS files for each component
- Global CSS variables for dark theme

**New:**
- CSS Modules (`.module.css`)
- Scoped styles per component
- Professional design system in `globals.css`

## Migration Steps for Your Own Components

### 1. Convert to 'use client' directive
Add at the top of interactive components:
```jsx
'use client';

import { useState } from 'react';
// ... rest of your code
```

### 2. Update imports
```jsx
// Old
import axios from 'axios';
import API_URL from '../config/api';

// New
import api from '@/lib/api';
```

### 3. Update API calls
```jsx
// Old
axios.get(`${API_URL}/api/slots`)

// New
api.get('/api/slots')
```

### 4. Update navigation
```jsx
// Old
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

// New
import { useRouter } from 'next/navigation';
const router = useRouter();
```

### 5. Convert CSS to CSS Modules
```jsx
// Old
import './MyComponent.css';

// New
import styles from './MyComponent.module.css';
<div className={styles.container}>...</div>
```

## Theme Customization

### Colors
Edit `src/styles/globals.css` to customize colors:
```css
:root {
  --primary-blue: #0066ff;    /* Change to your brand color */
  --accent-teal: #00b8d4;     /* Secondary accent */
  --success: #10b981;         /* Success color */
}
```

### Spacing
Adjust spacing variables:
```css
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
}
```

### Typography
Customize fonts:
```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...;
  --font-size-base: 1rem;
}
```

## Backend Compatibility

The Next.js app is fully compatible with your existing backend. No changes needed to the server code.

### API Configuration
Make sure your backend allows CORS from `http://localhost:3000`:
```javascript
// server/app.js
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
```

## Testing Checklist

- [ ] Authentication works (login/signup)
- [ ] Google OAuth redirects properly
- [ ] Admin can create/edit/delete teachers
- [ ] Admin can create/edit/delete slots
- [ ] Users can view available slots
- [ ] Users can book slots
- [ ] Users can cancel bookings
- [ ] Real-time updates work
- [ ] Responsive design works on mobile
- [ ] All API calls succeed

## Performance Tips

1. **Use Next.js Image**: Replace `<img>` with `<Image>` from `next/image`
2. **Code Splitting**: Already automatic with Next.js
3. **Lazy Loading**: Use dynamic imports for large components
4. **Font Optimization**: Use `next/font` for web fonts

## Troubleshooting

### Issue: "Module not found"
**Solution**: Check import paths use `@/` alias

### Issue: "useRouter is not a function"
**Solution**: Import from `next/navigation` not `next/router`

### Issue: "window is not defined"
**Solution**: Add `'use client'` directive to component

### Issue: API calls fail
**Solution**: Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [CSS Modules](https://nextjs.org/docs/app/building-your-application/styling/css-modules)

## Need Help?

If you encounter issues during migration:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure backend server is running
4. Check environment variables are set
5. Review the README.md for setup instructions

---

**Happy Migrating! 🚀**
