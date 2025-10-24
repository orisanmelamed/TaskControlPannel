import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import './AuthPage.scss';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Get the intended destination from location state
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // Switch between login and register modes
  const switchToLogin = () => setAuthMode('login');
  const switchToRegister = () => setAuthMode('register');

  return (
    <div className="auth-page">
      <div className="auth-page-background">
        <div className="auth-page-content">
          <div className="auth-container">
            {authMode === 'login' ? (
              <LoginForm onSwitchToRegister={switchToRegister} />
            ) : (
              <RegisterForm onSwitchToLogin={switchToLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;