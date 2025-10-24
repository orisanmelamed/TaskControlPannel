import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchProjects, 
  selectProjects,
  selectProjectsLoading 
} from '../store/slices/projectsSlice';
import { 
  selectTasks,
  selectTasksLoading,
  selectTaskStats
} from '../store/slices/tasksSlice';
import Header from '../components/layout/Header';
import './DashboardPage.scss';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const projects = useAppSelector(selectProjects);
  const tasks = useAppSelector(selectTasks);
  const projectsLoading = useAppSelector(selectProjectsLoading);
  const tasksLoading = useAppSelector(selectTasksLoading);
  const taskStats = useAppSelector(selectTaskStats);

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  const handleViewProjects = () => {
    navigate('/projects');
  };

  const handleViewTasks = () => {
    // If there are projects and tasks, navigate to the first project's detail page
    // Otherwise, navigate to projects page to create a project first
    if (projects.length > 0 && tasks.length > 0) {
      navigate(`/projects/${projects[0].projectNumber}`);
    } else {
      navigate('/projects');
    }
  };

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
                    <span className="metric-number">
                      {projectsLoading ? '...' : projects.length}
                    </span>
                    <span className="metric-label">Total Projects</span>
                  </div>
                  <p className="card-text">
                    {projects.length === 0 
                      ? "No projects yet. Start by creating your first project to organize your tasks."
                      : `You have ${projects.length} project${projects.length === 1 ? '' : 's'} to manage your tasks.`
                    }
                  </p>
                  <button className="btn btn-primary" onClick={handleCreateProject}>
                    Create Project
                  </Link>
                </div>
              </div>

              <div className="card dashboard-card">
                <div className="card-header">
                  <h3>Tasks</h3>
                </div>
                <div className="card-body">
                  <div className="metric">
                    <span className="metric-number">
                      {tasksLoading ? '...' : tasks.length}
                    </span>
                    <span className="metric-label">Total Tasks</span>
                  </div>
                  <p className="card-text">
                    {tasks.length === 0 
                      ? "No tasks yet. Create a project first, then add tasks to get started."
                      : `You have ${tasks.length} task${tasks.length === 1 ? '' : 's'} across all projects.`
                    }
                  </p>
                  <button className="btn btn-secondary" onClick={handleViewTasks}>
                    View All Tasks
                  </button>
                </div>
              </div>

              <div className="card dashboard-card">
                <div className="card-header">
                  <h3>Task Overview</h3>
                </div>
                <div className="card-body">
                  {tasks.length > 0 ? (
                    <div className="task-overview">
                      <div className="task-stats-grid">
                        <div className="stat-item">
                          <span className="stat-number">{taskStats.todo}</span>
                          <span className="stat-label">To Do</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{taskStats.inProgress}</span>
                          <span className="stat-label">In Progress</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{taskStats.completed}</span>
                          <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">{taskStats.blocked}</span>
                          <span className="stat-label">Blocked</span>
                        </div>
                      </div>
                      <div className="completion-rate">
                        <div className="completion-bar">
                          <div 
                            className="completion-fill" 
                            style={{ width: `${taskStats.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="completion-text">
                          {taskStats.completionRate}% Complete
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="card-text">
                      No tasks yet. Create a project and add tasks to see your progress here.
                    </p>
                  )}
                </div>
              </div>

              <div className="card dashboard-card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="card-body">
                  <div className="quick-actions">
                    <button className="btn btn-primary btn-block" onClick={handleCreateProject}>
                      Create New Project
                    </button>
                    <button className="btn btn-secondary btn-block" onClick={handleViewProjects}>
                      View All Projects
                    </button>
                    <button className="btn btn-secondary btn-block" onClick={handleViewTasks}>
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