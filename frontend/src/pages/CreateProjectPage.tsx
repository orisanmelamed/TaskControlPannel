import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createProject, selectProjectsLoading, selectProjectsError } from '../store/slices/projectsSlice';
import { CreateProjectRequest } from '../types';
import Header from '../components/layout/Header';
import './CreateProjectPage.scss';

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux state
  const isLoading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);
  
  // Form state
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(createProject({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      })).unwrap();
      
      // Navigate to the newly created project
      navigate(`/projects/${result.projectNumber}`);
    } catch (error: any) {
      // Error is handled by Redux state
      console.error('Failed to create project:', error);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <div className="create-project-page">
      <Header />
      
      <main className="create-project-main">
        <div className="container">
          <div className="create-project-content">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
              <Link to="/projects">Projects</Link>
              <span className="separator">/</span>
              <span className="current">Create New Project</span>
            </nav>

            {/* Header */}
            <div className="page-header">
              <h1>Create New Project</h1>
              <p>Set up a new project to organize your tasks and collaborate with your team.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            {/* Create Project Form */}
            <div className="form-container">
              <form onSubmit={handleSubmit} className="create-project-form">
                <div className="form-section">
                  <h2>Project Details</h2>
                  
                  <div className="form-group">
                    <label htmlFor="name" className="form-label required">
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Enter project name..."
                      maxLength={100}
                      disabled={isLoading}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Describe what this project is about..."
                      rows={4}
                      maxLength={500}
                      disabled={isLoading}
                    />
                    <small className="form-hint">
                      {formData.description?.length || 0}/500 characters
                    </small>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || !formData.name.trim()}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-sm"></span>
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProjectPage;