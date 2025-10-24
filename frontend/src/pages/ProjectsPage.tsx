import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchProjects,
  deleteProject,
  setSearchTerm,
  clearError,
  selectFilteredAndSortedProjects,
  selectProjectsLoading,
  selectProjectsError,
  selectSearchTerm,
} from '../store/slices/projectsSlice';
import Header from '../components/layout/Header';
import { formatDate } from '../utils/dateUtils';
import './ProjectsPage.scss';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux state
  const projects = useAppSelector(selectFilteredAndSortedProjects);
  const isLoading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);
  const searchTerm = useAppSelector(selectSearchTerm);
  
  // Local state for UI interactions
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Load projects on component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleDeleteProject = async (projectNumber: number) => {
    try {
      await dispatch(deleteProject(projectNumber)).unwrap();
      setDeleteConfirm(null);
    } catch (error: any) {
      // Error is handled by Redux state
      console.error('Failed to delete project:', error);
    }
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleRetry = () => {
    dispatch(fetchProjects());
  };

  const confirmDelete = (projectNumber: number) => {
    setDeleteConfirm(projectNumber);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="projects-page">
        <Header />
        <main className="projects-main">
          <div className="container">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading projects...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <Header />
      
      <main className="projects-main">
        <div className="container">
          <div className="projects-header">
            <div className="projects-title">
              <h2>My Projects</h2>
              <p>Manage and organize your projects</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/projects/new')}
            >
              Create New Project
            </button>
          </div>

          {/* Search and filters */}
          <div className="projects-controls">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={handleRetry} className="btn btn-secondary">
                Try Again
              </button>
            </div>
          )}

          {projects.length === 0 && !error ? (
            <div className="empty-state">
              <div className="empty-content">
                <h3>No Projects Yet</h3>
                <p>Get started by creating your first project to organize your tasks.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/projects/new')}
                >
                  Create Your First Project
                </button>
              </div>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project: Project) => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <div className="project-info">
                      <h3 className="project-name">
                        <Link to={`/projects/${project.projectNumber}`}>
                          {project.name}
                        </Link>
                      </h3>
                      <span className="project-number">#{project.projectNumber}</span>
                    </div>
                    <div className="project-actions">
                      <button
                        className="btn-icon"
                        onClick={() => navigate(`/projects/${project.projectNumber}/edit`)}
                        title="Edit Project"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => confirmDelete(project.projectNumber)}
                        title="Delete Project"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="project-body">
                    {project.description ? (
                      <p className="project-description">{project.description}</p>
                    ) : (
                      <p className="project-description no-description">
                        No description provided
                      </p>
                    )}
                  </div>
                  
                  <div className="project-footer">
                    <span className="project-date">
                      Created {formatDate(project.createdAt)}
                    </span>
                    <Link 
                      to={`/projects/${project.projectNumber}/tasks`}
                      className="btn btn-secondary btn-sm"
                    >
                      View Tasks
                    </Link>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {deleteConfirm === project.projectNumber && (
                    <div className="delete-modal">
                      <div className="delete-content">
                        <h4>Delete Project?</h4>
                        <p>
                          Are you sure you want to delete "{project.name}"? 
                          This action cannot be undone and will also delete all associated tasks.
                        </p>
                        <div className="delete-actions">
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleDeleteProject(project.projectNumber)}
                          >
                            Delete
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={cancelDelete}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;