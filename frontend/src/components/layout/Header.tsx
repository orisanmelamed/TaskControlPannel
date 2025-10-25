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

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
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
            <ul className="nav-links">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/projects" 
                  className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link 
                  to="/tasks" 
                  className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
                >
                  Tasks
                </Link>
              </li>
            </ul>
            
            <div className="user-menu">
              <span className="user-info">
                {user?.name || user?.email || 'User'}
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