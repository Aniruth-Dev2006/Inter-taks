'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './success.module.css';

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userString = searchParams.get('user');
    
    if (userString) {
      try {
        const userData = JSON.parse(decodeURIComponent(userString));
        
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (err) {
        console.error('Error parsing user data:', err);
        router.push('/auth');
      }
    } else {
      // No user data, redirect to auth
      router.push('/auth');
    }
  }, [searchParams, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>
          <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        </div>
        <h1>Authentication Successful!</h1>
        <p>Redirecting to your dashboard...</p>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
}
