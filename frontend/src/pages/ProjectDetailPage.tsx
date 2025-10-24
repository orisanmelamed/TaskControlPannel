import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchTasks,
  selectTaskStats,
} from '../store/slices/tasksSlice';
import Header from '../components/layout/Header';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { Task } from '../types';
import { formatDate } from '../utils/dateUtils';
import './ProjectDetailPage.scss';

const ProjectDetailPage: React.FC = () => {
  const { projectNumber } = useParams<{ projectNumber: string }>();

  const dispatch = useAppDispatch();
  
  // Redux state for tasks
  const taskStats = useAppSelector(selectTaskStats);
  
  // Local state for UI interactions
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Mock project data for now (replace with actual project fetching later)
  const project = {
    id: '1',
    projectNumber: parseInt(projectNumber || '1'),
    name: `Project ${projectNumber}`,
    description: 'This is a sample project for task management.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    if (projectNumber) {
      dispatch(fetchTasks(parseInt(projectNumber)));
    }
  }, [projectNumber, dispatch]);

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleTaskFormSuccess = () => {
    // The Redux store will automatically update through the action
  };

  if (!projectNumber) {
    return (
      <div className="project-detail-page">
        <Header />
        <main className="project-detail-main">
          <div className="container">
            <div className="not-found-state">
              <h3>Invalid Project</h3>
              <p>No project number provided.</p>
              <Link to="/projects" className="btn btn-primary">
                Back to Projects
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <Header />
      
      <main className="project-detail-main">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/projects">Projects</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{project.name}</span>
          </nav>

          {/* Project Header */}
          <div className="project-header">
            <div className="project-info">
              <div className="project-title">
                <h1>{project.name}</h1>
                <span className="project-number">#{project.projectNumber}</span>
              </div>
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              <div className="project-meta">
                <span>Created {formatDate(project.createdAt)}</span>
                {project.updatedAt !== project.createdAt && (
                  <span>Updated {formatDate(project.updatedAt)}</span>
                )}
              </div>
            </div>
            
            <div className="project-actions">
              <Link 
                to={`/projects/${project.projectNumber}/edit`}
                className="btn btn-secondary"
              >
                Edit Project
              </Link>
            </div>
          </div>

          {/* Project Content */}
          <div className="project-content">
            {/* Task Statistics */}
            <div className="content-section">
              <h2>Project Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{taskStats?.total || 0}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{taskStats?.completed || 0}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{taskStats?.inProgress || 0}</div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{taskStats?.todo || 0}</div>
                  <div className="stat-label">To Do</div>
                </div>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="content-section">
              <div className="section-header">
                <h2>Tasks</h2>
                <button 
                  onClick={handleCreateTask}
                  className="btn btn-primary"
                >
                  Add Task
                </button>
              </div>
              
              <TaskList 
                projectNumber={parseInt(projectNumber)}
                onEditTask={handleEditTask}
              />
            </div>
          </div>

          {/* Task Form Modal */}
          {showTaskForm && (
            <TaskForm
              projectNumber={parseInt(projectNumber)}
              task={editingTask}
              onClose={handleCloseTaskForm}
              onSuccess={handleTaskFormSuccess}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;