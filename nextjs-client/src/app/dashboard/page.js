'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';
import UserDashboard from '@/components/UserDashboard';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth');
    } else {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (err) {
        localStorage.removeItem('user');
        router.push('/auth');
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.dashboardWrapper}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div className={styles.logo}>
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="var(--primary-blue)"/>
                  <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>SlotBook</span>
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>{currentUser.name}</span>
                  <span className={styles.userRole}>
                    {currentUser.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          {currentUser.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <UserDashboard user={currentUser} />
          )}
        </div>
      </main>
    </div>
  );
}
