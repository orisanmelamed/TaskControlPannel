import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.scss';

const Header: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <div className="header-brand">
            <h1>Task Control Panel</h1>
          </div>
          
          <nav className="header-nav">
            <div className="user-menu">
              <span className="user-info">
                Welcome, {user?.name || user?.email || 'User'}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="btn btn-secondary logout-btn"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;