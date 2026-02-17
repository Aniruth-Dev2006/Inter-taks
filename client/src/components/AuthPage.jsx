import React, { useState } from 'react';
import Signin from './Signin';
import Signup from './Signup';

function AuthPage({ onAuthSuccess }) {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      {showSignup ? (
        <Signup
          onSwitchToLogin={() => setShowSignup(false)}
          onSignupSuccess={onAuthSuccess}
        />
      ) : (
        <Signin
          onSwitchToSignup={() => setShowSignup(true)}
          onLoginSuccess={onAuthSuccess}
        />
      )}
    </>
  );
}

export default AuthPage;
