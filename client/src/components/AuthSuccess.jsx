import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthSuccess({ onLoginSuccess }) {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');

    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        console.log('OAuth user:', user);
        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess(user);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate, onLoginSuccess]);

  return (
    <div className="loading-screen">
      <p>Authenticating with Google...</p>
    </div>
  );
}

export default AuthSuccess;
