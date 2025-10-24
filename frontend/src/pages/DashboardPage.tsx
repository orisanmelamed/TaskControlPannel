import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import './DashboardPage.scss';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <Header />
      
      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header">
            <h2>Dashboard</h2>
            <p>Welcome back, {user?.name || user?.email}!</p>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-grid">
              <div className="card dashboard-card">
                <div className="card-header">
                  <h3>Projects</h3>
                </div>
                <div className="card-body">
                  <div className="metric">
                    <span className="metric-number">0</span>
                    <span className="metric-label">Total Projects</span>
                  </div>
                  <p className="card-text">
                    No projects yet. Start by creating your first project to organize your tasks.
                  </p>
                  <button className="btn btn-primary">
                    Create Project
                  </button>
                </div>
              </div>

              <div className="card dashboard-card">
                <div className="card-header">
                  <h3>Tasks</h3>
                </div>
                <div className="card-body">
                  <div className="metric">
                    <span className="metric-number">0</span>
                    <span className="metric-label">Total Tasks</span>
                  </div>
                  <p className="card-text">
                    No tasks yet. Create a project first, then add tasks to get started.
                  </p>
                  <button className="btn btn-secondary">
                    View All Tasks
                  </button>
                </div>
              </div>

              <div className="card dashboard-card">
                <div className="card-header">
                  <h3>Recent Activity</h3>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    No recent activity. Start creating projects and tasks to see your activity here.
                  </p>
                </div>
              </div>

              <div className="card dashboard-card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="card-body">
                  <div className="quick-actions">
                    <button className="btn btn-primary btn-block">
                      Create New Project
                    </button>
                    <button className="btn btn-secondary btn-block">
                      View All Projects
                    </button>
                    <button className="btn btn-secondary btn-block">
                      View All Tasks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;