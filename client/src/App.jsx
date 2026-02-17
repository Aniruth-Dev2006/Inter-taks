import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import AuthPage from './components/AuthPage';
import UserSignup from './components/UserSignup';
import AuthSuccess from './components/AuthSuccess';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    // Add axios interceptor to handle 401 errors globally
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear localStorage and redirect to login
          localStorage.removeItem('user');
          setCurrentUser(null);
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !currentUser ? (
              <AuthPage onAuthSuccess={setCurrentUser} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !currentUser ? (
              <UserSignup onLoginSuccess={setCurrentUser} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/auth/success"
          element={<AuthSuccess onLoginSuccess={setCurrentUser} />}
        />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <div className="app-container">
                <header className="app-header">
                  <div className="header-content">
                    <h1>📅 Slot Booking System</h1>
                    <div className="header-right">
                      <span className="user-info">
                        {currentUser.name} ({currentUser.role.toUpperCase()})
                      </span>
                      <button className="logout-btn" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                </header>

                <main className="app-main">
                  {currentUser.role === 'admin' ? (
                    <AdminDashboard user={currentUser} />
                  ) : (
                    <UserDashboard user={currentUser} />
                  )}
                </main>

                <footer className="app-footer">
                  <p>&copy; 2026 Slot Booking System. All rights reserved.</p>
                </footer>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
