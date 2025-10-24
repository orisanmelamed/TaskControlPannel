import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchProject,
  deleteProject,
  clearCurrentProject,
  selectCurrentProject,
  selectProjectsLoading,
  selectProjectsError,
} from '../store/slices/projectsSlice';
import Header from '../components/layout/Header';
import { formatDate } from '../utils/dateUtils';
import './ProjectDetailPage.scss';

const ProjectDetailPage: React.FC = () => {
  const { projectNumber } = useParams<{ projectNumber: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux state
  const project = useAppSelector(selectCurrentProject);
  const isLoading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);
  
  // Local state for UI interactions
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (projectNumber) {
      dispatch(fetchProject(parseInt(projectNumber)));
    }
    
    // Clear current project when leaving the component
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [projectNumber, dispatch]);

  const handleDeleteProject = async () => {
    if (!project) return;
    
    try {
      await dispatch(deleteProject(project.projectNumber)).unwrap();
      navigate('/projects');
    } catch (error: any) {
      // Error is handled by Redux state
      setShowDeleteConfirm(false);
      console.error('Failed to delete project:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="project-detail-page">
        <Header />
        <main className="project-detail-main">
          <div className="container">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading project...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-page">
        <Header />
        <main className="project-detail-main">
          <div className="container">
            <div className="error-state">
              <h3>Error Loading Project</h3>
              <p>{error}</p>
              <div className="error-actions">
                <button onClick={() => navigate('/projects')} className="btn btn-primary">
                  Back to Projects
                </button>
                <button onClick={() => window.location.reload()} className="btn btn-secondary">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <Header />
        <main className="project-detail-main">
          <div className="container">
            <div className="not-found-state">
              <h3>Project Not Found</h3>
              <p>The project you're looking for doesn't exist or you don't have access to it.</p>
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
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-danger"
              >
                Delete Project
              </button>
            </div>
          </div>

          {/* Project Content */}
          <div className="project-content">
            <div className="content-section">
              <div className="section-header">
                <h2>Tasks</h2>
                <Link 
                  to={`/projects/${project.projectNumber}/tasks/new`}
                  className="btn btn-primary"
                >
                  Add Task
                </Link>
              </div>
              
              <div className="tasks-preview">
                <p className="coming-soon">
                  Task management coming soon! For now, you can manage your project details.
                </p>
                <Link 
                  to={`/projects/${project.projectNumber}/tasks`}
                  className="btn btn-secondary"
                >
                  View All Tasks
                </Link>
              </div>
            </div>

            <div className="content-section">
              <h2>Project Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">0</div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">0</div>
                  <div className="stat-label">To Do</div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Delete Project</h3>
                <p>
                  Are you sure you want to delete "{project.name}"? 
                  This action cannot be undone and will also delete all associated tasks.
                </p>
                <div className="modal-actions">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteProject}
                    className="btn btn-danger"
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;