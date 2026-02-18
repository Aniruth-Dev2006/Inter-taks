# Slot Booking System - Next.js Professional Edition

A modern, industry-level slot booking and scheduling platform built with Next.js 14, featuring a professional theme inspired by enterprise applications like Zoho.

## Features

### 🎨 Professional UI/UX
- Clean, modern design with enterprise-grade aesthetics
- Smooth animations and transitions
- Fully responsive across all devices
- Accessible component design
- Professional color scheme (blue/teal palette)

### 🔐 Authentication
- Email/password authentication
- Google OAuth integration
- Role-based access control (Admin/User)
- Secure session management

### 👥 User Features
- Browse available slots
- Real-time slot availability
- Book consultation slots
- View and manage bookings
- Cancel bookings

### 🎯 Admin Features
- Dashboard with statistics
- Teacher management (CRUD operations)
- Slot management (CRUD operations)
- View all bookings
- Real-time data synchronization

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript
- **Styling**: CSS Modules + Custom CSS Variables
- **HTTP Client**: Axios
- **Authentication**: JWT + OAuth
- **API**: RESTful backend (Node.js/Express)

## Theme Features

### Professional Color Palette
- Primary: Professional Blue (#0066ff)
- Secondary: Neutral Grays
- Accent: Teal (#00b8d4), Purple (#6366f1)
- Semantic: Success, Warning, Error, Info colors

### Design System
- Consistent spacing system (xs to 3xl)
- Typography scale (xs to 4xl)
- Border radius system (sm to full)
- Shadow system (xs to 2xl)
- Smooth transitions (fast, base, slow)

### Components
- Reusable button variants (primary, secondary, outline, success, danger)
- Card components with hover effects
- Badge components for status indicators
- Loading spinners and states
- Toast notifications
- Empty states
- Data tables

## Getting Started

### Prerequisites

```bash
Node.js 18+ installed
npm or yarn package manager
Backend API running (server folder)
```

### Installation

1. Navigate to the Next.js client directory:
```bash
cd nextjs-client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Project Structure

```
nextjs-client/
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout with metadata
│   │   ├── page.js                # Landing page
│   │   ├── page.module.css
│   │   ├── auth/
│   │   │   ├── page.js            # Authentication page
│   │   │   └── auth.module.css
│   │   └── dashboard/
│   │       ├── page.js            # Dashboard page
│   │       └── dashboard.module.css
│   ├── components/
│   │   ├── AdminDashboard.js      # Admin dashboard component
│   │   ├── AdminDashboard.module.css
│   │   ├── UserDashboard.js       # User dashboard component
│   │   ├── UserDashboard.module.css
│   │   ├── TeacherManagement.js   # Teacher CRUD component
│   │   └── SlotManagement.js      # Slot CRUD component
│   ├── lib/
│   │   └── api.js                 # Axios instance with interceptors
│   └── styles/
│       └── globals.css            # Global styles & design system
├── public/                        # Static assets
├── next.config.mjs                # Next.js configuration
├── package.json
└── .env.local                     # Environment variables
```

## Key Differences from React+Vite Version

### 1. Routing
- **Old**: React Router DOM with client-side routing
- **New**: Next.js App Router with file-based routing
- Benefits: Better SEO, automatic code splitting, server components

### 2. Styling
- **Old**: Dark theme with purple/violet glow effects
- **New**: Professional light theme with blue/teal accents
- Benefits: More professional appearance, better readability, enterprise-ready

### 3. Build System
- **Old**: Vite (fast dev server, ES modules)
- **New**: Next.js (optimized production builds, automatic optimization)
- Benefits: Better performance, image optimization, font optimization

### 4. Data Fetching
- **Old**: Client-side only with useEffect
- **New**: Can use server components for initial data (future enhancement)
- Benefits: Faster initial page loads, better SEO

## Design Principles

1. **Simplicity**: Clean, uncluttered interface
2. **Consistency**: Uniform spacing, colors, and typography
3. **Accessibility**: Keyboard navigation, ARIA labels, semantic HTML
4. **Performance**: Optimized assets, lazy loading, minimal bundle size
5. **Responsiveness**: Mobile-first design, fluid layouts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## API Integration

The application connects to the backend API at the URL specified in `NEXT_PUBLIC_API_URL`. Ensure the backend server is running before starting the Next.js app.

### API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/google` - Google OAuth
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create teacher
- `GET /api/slots` - Get all slots
- `POST /api/slots` - Create slot
- `GET /api/bookings/all` - Get all bookings (admin)
- `GET /api/bookings/my-bookings/:userId` - Get user bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/:id/:userId` - Cancel booking

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## Performance Optimizations

- CSS modules for scoped styling
- Automatic code splitting per route
- Image optimization (use Next.js Image component)
- Font optimization with next/font
- Minimal JavaScript bundle
- Server-side rendering for faster initial loads

## Future Enhancements

- [ ] Server components for data fetching
- [ ] API routes for backend integration
- [ ] Image optimization with next/image
- [ ] Progressive Web App (PWA) support
- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Payment integration with Razorpay
- [ ] Advanced filtering and search
- [ ] Export data to CSV/PDF

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or production.

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js 14**
