import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectFilteredAndSortedTasks,
  selectTasksLoading,
  selectTasksError,
  selectFilterStatus,
  selectTaskStats,
  setFilterStatus,
  fetchTasks,
} from '../store/slices/tasksSlice';
import {
  fetchProjects,
  selectProjects,
} from '../store/slices/projectsSlice';
import { Task, TaskStatus, Project } from '../types';
import Header from '../components/layout/Header';
import TaskItem from '../components/tasks/TaskItem';
import './AllTasksPage.scss';

const AllTasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  console.log('AllTasksPage component rendered');
  
  // Redux state
  const tasks = useAppSelector(selectFilteredAndSortedTasks);
  const projects = useAppSelector(selectProjects);
  const isLoading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  const filterStatus = useAppSelector(selectFilterStatus);
  const taskStats = useAppSelector(selectTaskStats);

  // Load projects and tasks on mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Load tasks for all projects after projects are loaded
  useEffect(() => {
    if (projects.length > 0) {
      projects.forEach((project: Project) => {
        dispatch(fetchTasks(project.projectNumber));
      });
    }
  }, [projects, dispatch]);

  const handleFilterChange = (status: TaskStatus | 'ALL') => {
    dispatch(setFilterStatus(status));
  };

  // Get project name by projectId
  const getProjectName = (projectId: string) => {
    const project = projects.find((p: Project) => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  // Get project number by projectId
  const getProjectNumber = (projectId: string) => {
    const project = projects.find((p: Project) => p.id === projectId);
    return project ? project.projectNumber : null;
  };

  const handleTaskClick = (task: Task) => {
    const projectNumber = getProjectNumber(task.projectId);
    if (projectNumber) {
      navigate(`/projects/${projectNumber}`);
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="all-tasks-page">
        <Header />
        <main className="all-tasks-main">
          <div className="container">
            <div className="all-tasks-loading">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-tasks-page">
        <Header />
        <main className="all-tasks-main">
          <div className="container">
            <div className="all-tasks-error">
              <p>Error loading tasks: {error}</p>
              <button 
                onClick={() => dispatch(fetchProjects())}
                className="btn btn-secondary"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="all-tasks-page">
      <Header />
      
      <main className="all-tasks-main">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-left">
              <h1>All Tasks</h1>
              <p className="subtitle">View and manage tasks across all your projects</p>
            </div>
            <div className="header-right">
              <Link to="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Task Statistics */}
          <div className="task-stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{taskStats.total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{taskStats.todo}</div>
                <div className="stat-label">To Do</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{taskStats.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{taskStats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              {taskStats.blocked > 0 && (
                <div className="stat-card">
                  <div className="stat-number">{taskStats.blocked}</div>
                  <div className="stat-label">Blocked</div>
                </div>
              )}
            </div>
            
            {taskStats.total > 0 && (
              <div className="completion-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${taskStats.completionRate}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {taskStats.completionRate}% Complete
                </span>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filters-header">
              <h3>Filter by Status</h3>
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
                onClick={() => handleFilterChange('ALL')}
              >
                All ({taskStats.total})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'TODO' ? 'active' : ''}`}
                onClick={() => handleFilterChange('TODO')}
              >
                To Do ({taskStats.todo})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'IN_PROGRESS' ? 'active' : ''}`}
                onClick={() => handleFilterChange('IN_PROGRESS')}
              >
                In Progress ({taskStats.inProgress})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'BLOCKED' ? 'active' : ''}`}
                onClick={() => handleFilterChange('BLOCKED')}
              >
                Blocked ({taskStats.blocked})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'DONE' ? 'active' : ''}`}
                onClick={() => handleFilterChange('DONE')}
              >
                Done ({taskStats.completed})
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="tasks-section">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-content">
                  <h3>No tasks found</h3>
                  <p>
                    {filterStatus === 'ALL' 
                      ? 'Get started by creating a project and adding tasks.'
                      : `No tasks with status "${filterStatus.toLowerCase().replace('_', ' ')}".`
                    }
                  </p>
                  {filterStatus !== 'ALL' && (
                    <button 
                      onClick={() => handleFilterChange('ALL')}
                      className="btn btn-secondary"
                    >
                      View All Tasks
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="tasks-list">
                {tasks.map((task) => (
                  <div key={task.id} className="task-wrapper">
                    <div className="task-project-label">
                      <Link to={`/projects/${getProjectNumber(task.projectId)}`}>
                        {getProjectName(task.projectId)}
                      </Link>
                    </div>
                    <TaskItem 
                      task={task} 
                      projectNumber={getProjectNumber(task.projectId) || 0}
                      onEdit={() => handleTaskClick(task)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllTasksPage;
