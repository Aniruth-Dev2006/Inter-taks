'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import api from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [specialists, setSpecialists] = useState([]);
  const [slots, setSlots] = useState([]);
  const [specialistsLoading, setSpecialistsLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }

    // Fetch specialists and slots
    const fetchData = async () => {
      try {
        const [specialistsRes, slotsRes] = await Promise.all([
          api.get('/api/teachers'),
          api.get('/api/slots')
        ]);
        setSpecialists(specialistsRes.data);
        setSlots(slotsRes.data.filter(slot => slot.availableSeats > 0));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setSpecialistsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      <nav className={styles.navbar}>
        <div className="container">
          <div className={styles.navContent}>
            <div className={styles.logo}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="var(--primary-blue)"/>
                <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>SlotBook</span>
            </div>
            <div className={styles.navLinks}>
              <a href="#features" className={styles.navLink}>Features</a>
              <button 
                onClick={() => router.push('/about')} 
                className={styles.navLink}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: 'inherit' }}
              >
                About
              </button>
              <button 
                onClick={() => router.push('/auth')} 
                className="btn btn-outline"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Professional Slot Booking
                <span className={styles.gradientText}> Made Simple</span>
              </h1>
              <p className={styles.heroDescription}>
                Streamline your scheduling process with our enterprise-grade booking platform. 
                Manage appointments, specialists, and resources with ease.
              </p>
              <div className={styles.heroActions}>
                <button 
                  onClick={() => router.push('/auth/signup')} 
                  className="btn btn-primary btn-lg"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => router.push('/auth')} 
                  className="btn btn-secondary btn-lg"
                >
                  Sign In
                </button>
              </div>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Real-time Availability</span>
                </div>
                <div className={styles.feature}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Secure Payments</span>
                </div>
                <div className={styles.feature}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Smart Notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className={styles.featuresSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Everything you need to manage bookings</h2>
          <div className={styles.featuresGrid}>
            <div className="card">
              <div className={styles.featureIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3>Smart Scheduling</h3>
              <p>Intelligent slot management with conflict detection and automated notifications.</p>
            </div>
            <div className="card">
              <div className={styles.featureIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Specialist Management</h3>
              <p>Comprehensive profiles, availability tracking, and performance metrics.</p>
            </div>
            <div className="card">
              <div className={styles.featureIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3>Secure Payments</h3>
              <p>Integrated payment processing with Razorpay for seamless transactions.</p>
            </div>
            <div className="card">
              <div className={styles.featureIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Real-time insights and reports to optimize your operations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.specialistsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Expert Specialists</h2>
          <p className={styles.sectionSubtitle}>
            Connect with our team of experienced professionals across various domains
          </p>
          
          {specialistsLoading ? (
            <div className={styles.loadingSpinner}>
              <div className="spinner"></div>
              <p>Loading specialists...</p>
            </div>
          ) : specialists.length > 0 ? (
            <div className={styles.specialistsGrid}>
              {specialists.map((specialist) => {
                const specialistSlots = slots.filter(slot => 
                  slot.teacher?._id === specialist._id || slot.teacherName === specialist.name
                );
                
                return (
                  <div 
                    key={specialist._id} 
                    className="card"
                    onClick={() => specialistSlots.length > 0 && setSelectedSpecialist(specialist)}
                    style={{ cursor: specialistSlots.length > 0 ? 'pointer' : 'default' }}
                  >
                    <div className={styles.specialistCard}>
                      <div className={styles.specialistHeader}>
                        <div className={styles.specialistIcon}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </div>
                        <div className={styles.specialistInfo}>
                          <h3>{specialist.name}</h3>
                          <div className={styles.specialistDomain}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                            </svg>
                            <span>{specialist.subject}</span>
                          </div>
                          {specialist.department && (
                            <p className={styles.specialistDepartment}>{specialist.department}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.slotsSummary}>
                        <div className={styles.slotsCount}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span>
                            {specialistSlots.length > 0 
                              ? `${specialistSlots.length} slot${specialistSlots.length !== 1 ? 's' : ''} available` 
                              : 'No slots available'}
                          </span>
                        </div>
                        {specialistSlots.length > 0 && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No specialists available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Specialist Slots Modal */}
      {selectedSpecialist && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSpecialist(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.specialistModalInfo}>
                <div className={styles.specialistIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <h3>{selectedSpecialist.name}</h3>
                  <div className={styles.specialistDomain}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    <span>{selectedSpecialist.subject}</span>
                  </div>
                  {selectedSpecialist.department && (
                    <p className={styles.specialistDepartment}>{selectedSpecialist.department}</p>
                  )}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedSpecialist(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <h4>Available Slots</h4>
              <div className={styles.slotsList}>
                {slots
                  .filter(slot => 
                    slot.teacher?._id === selectedSpecialist._id || 
                    slot.teacherName === selectedSpecialist.name
                  )
                  .map((slot) => (
                    <div key={slot._id} className={styles.slotItem}>
                      <div className={styles.slotInfo}>
                        <div className={styles.slotDate}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span>{slot.date}</span>
                        </div>
                        <div className={styles.slotTime}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <div className={styles.slotSeats}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                          <span>{slot.availableSeats}/{slot.capacity} seats</span>
                        </div>
                      </div>
                      <div className={styles.slotPrice}>
                        ₹{slot.price || 500}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                onClick={() => router.push('/auth/signup')} 
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                Sign Up to Book These Slots
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; 2026 SlotBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
