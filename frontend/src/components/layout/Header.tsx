import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.scss';

const Header: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();

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
            <Link to="/dashboard" className="brand-link">
              <h1>Task Control Panel</h1>
            </Link>
          </div>
          
          <nav className="header-nav">
            <div className="nav-links">
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/projects" 
                className={`nav-link ${location.pathname.startsWith('/projects') ? 'active' : ''}`}
              >
                Projects
              </Link>
            </div>
            
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