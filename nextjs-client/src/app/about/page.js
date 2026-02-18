'use client';

import { useRouter } from 'next/navigation';
import styles from './about.module.css';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className={styles.aboutContainer}>
      <nav className={styles.navbar}>
        <div className="container">
          <div className={styles.navContent}>
            <div className={styles.logo} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="var(--primary-blue)"/>
                <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>SlotBook</span>
            </div>
            <div className={styles.navLinks}>
              <button 
                onClick={() => router.push('/')} 
                className={styles.navLink}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: 'inherit' }}
              >
                Home
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

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>About SlotBook</h1>
            <p className={styles.subtitle}>
              Your trusted platform for professional scheduling and booking management
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.content}>
              <div className={styles.contentBlock}>
                <h2>Our Mission</h2>
                <p>
                  SlotBook is designed to simplify the complex process of scheduling and booking management. 
                  We empower specialists and service providers to manage their time efficiently while providing 
                  clients with a seamless booking experience.
                </p>
              </div>

              <div className={styles.contentBlock}>
                <h2>What We Offer</h2>
                <div className={styles.features}>
                  <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <h3>Smart Scheduling</h3>
                      <p>Intelligent slot management with real-time availability and conflict detection</p>
                    </div>
                  </div>

                  <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <div>
                      <h3>Specialist Profiles</h3>
                      <p>Comprehensive management for specialists with detailed profiles and availability</p>
                    </div>
                  </div>

                  <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <h3>Secure Payments</h3>
                      <p>Integrated Razorpay payment processing for safe and seamless transactions</p>
                    </div>
                  </div>

                  <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10"/>
                        <line x1="12" y1="20" x2="12" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="14"/>
                      </svg>
                    </div>
                    <div>
                      <h3>Analytics & Insights</h3>
                      <p>Detailed reporting and analytics to help you optimize your operations</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.contentBlock}>
                <h2>Why Choose SlotBook?</h2>
                <div className={styles.benefitsList}>
                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4>User-Friendly Interface</h4>
                      <p>Intuitive design that makes booking and management effortless</p>
                    </div>
                  </div>

                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4>Real-Time Updates</h4>
                      <p>Automatic synchronization and instant notifications for all bookings</p>
                    </div>
                  </div>

                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4>Secure & Reliable</h4>
                      <p>Enterprise-grade security with data encryption and secure payment processing</p>
                    </div>
                  </div>

                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4>Mobile Responsive</h4>
                      <p>Access from anywhere on any device with our fully responsive design</p>
                    </div>
                  </div>

                  <div className={styles.benefit}>
                    <div className={styles.benefitIcon}>
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h4>24/7 Support</h4>
                      <p>Dedicated support team ready to assist you whenever you need help</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.cta}>
                <h2>Ready to Get Started?</h2>
                <p>Join thousands of specialists and clients who trust SlotBook for their scheduling needs.</p>
                <button onClick={() => router.push('/auth')} className="btn btn-primary btn-lg">
                  Sign Up Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; 2024 SlotBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
