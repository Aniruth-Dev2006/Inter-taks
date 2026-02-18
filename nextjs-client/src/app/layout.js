import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Slot Booking System - Professional Scheduling Platform',
  description: 'Industry-level slot booking and management system',
  keywords: 'booking, scheduling, appointments, slot management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
