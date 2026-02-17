import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';
import TeacherManagement from './TeacherManagement';
import SlotManagement from './SlotManagement';

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('slots');
  const [stats, setStats] = useState({
    teachers: 0,
    slots: 0,
    bookings: 0,
  });
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchAllBookings();
    
    // Auto-refresh every 5 seconds to keep data synchronized
    const interval = setInterval(() => {
      fetchStats();
      fetchAllBookings();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const [teachersRes, slotsRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/teachers'),
        axios.get('http://localhost:3000/api/slots'),
        axios.get('http://localhost:3000/api/bookings/all'),
      ]);

      setStats({
        teachers: teachersRes.data.length,
        slots: slotsRes.data.length,
        bookings: bookingsRes.data.length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bookings/all');
      setAllBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Manage teachers and slots</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <p className="stat-label">Total Teachers</p>
            <p className="stat-value">{stats.teachers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <p className="stat-label">Total Slots</p>
            <p className="stat-value">{stats.slots}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Total Bookings</p>
            <p className="stat-value">{stats.bookings}</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          Manage Slots
        </button>
        <button
          className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          Manage Teachers
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'slots' && <SlotManagement user={user} onSlotUpdate={fetchStats} />}
        {activeTab === 'teachers' && <TeacherManagement user={user} onTeacherUpdate={fetchStats} />}
        {activeTab === 'bookings' && (
          <div className="bookings-view">
            <h3>All Bookings</h3>
            {allBookings.length === 0 ? (
              <p className="empty-state">No bookings yet</p>
            ) : (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User</th>
                      <th>Teacher</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map(booking => (
                      <tr key={booking._id}>
                        <td>{booking._id.substring(0, 8)}</td>
                        <td>
                          {booking.user?.name || 'N/A'}
                          <br />
                          <small>{booking.user?.email || ''}</small>
                        </td>
                        <td>{booking.teacher?.name || 'N/A'}</td>
                        <td>{booking.slot?.date || 'N/A'}</td>
                        <td>{booking.slot?.startTime || '-'} - {booking.slot?.endTime || '-'}</td>
                        <td>
                          <span className={`status-badge ${booking.status}`}>
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

export default AdminDashboard;
