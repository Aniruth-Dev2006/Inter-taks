'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import TeacherManagement from './TeacherManagement';
import SlotManagement from './SlotManagement';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('slots');
  const [stats, setStats] = useState({
    specialists: 0,
    slots: 0,
    bookings: 0,
  });
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchAllBookings();
    
    const interval = setInterval(() => {
      fetchStats();
      fetchAllBookings();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const [specialistsRes, slotsRes, bookingsRes] = await Promise.all([
        api.get('/api/teachers'),
        api.get('/api/slots'),
        api.get('/api/bookings/all'),
      ]);

      setStats({
        specialists: specialistsRes.data.length,
        slots: slotsRes.data.length,
        bookings: bookingsRes.data.length,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const response = await api.get('/api/bookings/all');
      setAllBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage specialists, slots, and view all bookings</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`card ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ background: 'var(--primary-blue)' }}>
            <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>{loading ? '...' : stats.specialists}</h3>
            <p>Total Specialists</p>
          </div>
        </div>

        <div className={`card ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ background: 'var(--accent-teal)' }}>
            <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>{loading ? '...' : stats.slots}</h3>
            <p>Total Slots</p>
          </div>
        </div>

        <div className={`card ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ background: 'var(--success)' }}>
            <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>{loading ? '...' : stats.bookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'slots' ? styles.active : ''}`}
            onClick={() => setActiveTab('slots')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            Manage Slots
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'specialists' ? styles.active : ''}`}
            onClick={() => setActiveTab('specialists')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            Manage Specialists
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'bookings' ? styles.active : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            All Bookings <span className="badge badge-info">{allBookings.length}</span>
          </button>
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'slots' && <SlotManagement onSlotUpdate={fetchStats} />}
        {activeTab === 'specialists' && <TeacherManagement onTeacherUpdate={fetchStats} />}
        {activeTab === 'bookings' && (
          <div className="card">
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>All Bookings</h2>
            {allBookings.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
                <p>No bookings yet</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User</th>
                      <th>Specialist</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map(booking => (
                      <tr key={booking._id}>
                        <td><code>{booking._id.substring(0, 8)}</code></td>
                        <td>
                          <div className={styles.userCell}>
                            <strong>{booking.user?.name || 'N/A'}</strong>
                            <small>{booking.user?.email || ''}</small>
                          </div>
                        </td>
                        <td>{booking.teacher?.name || 'N/A'}</td>
                        <td>{booking.slot?.date || 'N/A'}</td>
                        <td>{booking.slot?.startTime} - {booking.slot?.endTime}</td>
                        <td>
                          <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
