import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateProjectRequest, UpdateProjectRequest } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createProject,
  updateProject,
  fetchProject,
  clearCurrentProject,
  selectCurrentProject,
  selectProjectsLoading,
  selectProjectsError,
} from '../../store/slices/projectsSlice';
import Header from '../layout/Header';
import './ProjectForm.scss';

interface ProjectFormProps {
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  general?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { projectNumber } = useParams<{ projectNumber: string }>();
  const dispatch = useAppDispatch();
  
  // Redux state
  const currentProject = useAppSelector(selectCurrentProject);
  const isLoading = useAppSelector(selectProjectsLoading);
  const globalError = useAppSelector(selectProjectsError);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Load project data for edit mode
  useEffect(() => {
    if (mode === 'edit' && projectNumber) {
      dispatch(fetchProject(parseInt(projectNumber)));
    }
    
    // Clear current project when leaving the component
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [mode, projectNumber, dispatch]);

  // Update form data when project is loaded
  useEffect(() => {
    if (currentProject && mode === 'edit') {
      setFormData({
        name: currentProject.name,
        description: currentProject.description || '',
      });
    }
  }, [currentProject, mode]);

  // Update form errors if there's a global error
  useEffect(() => {
    if (globalError) {
      setErrors({ general: globalError });
    }
  }, [globalError]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle input blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    validateField(name);
  };

  // Validate individual field
  const validateField = (fieldName: string) => {
    const newErrors: FormErrors = { ...errors };

    switch (fieldName) {
      case 'name':
        if (!formData.name.trim()) {
          newErrors.name = 'Project name is required';
        } else if (formData.name.trim().length > 120) {
          newErrors.name = 'Project name must be less than 120 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'description':
        if (formData.description.length > 2000) {
          newErrors.description = 'Description must be less than 2000 characters';
        } else {
          delete newErrors.description;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length > 120) {
      newErrors.name = 'Project name must be less than 120 characters';
    }

    if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      description: true,
    });

    if (!validateForm()) {
      return;
    }

    setErrors({});

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };

      if (mode === 'create') {
        const resultAction = await dispatch(createProject(projectData as CreateProjectRequest));
        if (createProject.fulfilled.match(resultAction)) {
          navigate(`/projects/${resultAction.payload.projectNumber}`);
        }
      } else if (mode === 'edit' && projectNumber) {
        const resultAction = await dispatch(updateProject({
          projectNumber: parseInt(projectNumber),
          projectData: projectData as UpdateProjectRequest,
        }));
        if (updateProject.fulfilled.match(resultAction)) {
          navigate(`/projects/${resultAction.payload.projectNumber}`);
        }
      }
    } catch (error: any) {
      // Errors are handled by Redux state
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  if (isLoading && mode === 'edit') {
    return (
      <div className="project-form-page">
        <Header />
        <main className="project-form-main">
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

  return (
    <div className="project-form-page">
      <Header />
      
      <main className="project-form-main">
        <div className="container">
          <div className="project-form-header">
            <h2>{mode === 'create' ? 'Create New Project' : 'Edit Project'}</h2>
            <p>
              {mode === 'create' 
                ? 'Create a new project to organize your tasks' 
                : 'Update your project information'
              }
            </p>
          </div>

          <div className="project-form-container">
            <form onSubmit={handleSubmit} className="project-form">
              {/* Project Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Project Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  placeholder="Enter project name"
                  maxLength={120}
                  required
                />
                {touched.name && errors.name && (
                  <span className="form-error">{errors.name}</span>
                )}
                <div className="character-count">
                  {formData.name.length}/120 characters
                </div>
              </div>

              {/* Project Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-textarea ${errors.description ? 'form-input-error' : ''}`}
                  placeholder="Describe your project (optional)"
                  rows={5}
                  maxLength={2000}
                />
                {touched.description && errors.description && (
                  <span className="form-error">{errors.description}</span>
                )}
                <div className="character-count">
                  {formData.description.length}/2000 characters
                </div>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="form-error-general">
                  {errors.general}
                </div>
              )}

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                    : (mode === 'create' ? 'Create Project' : 'Update Project')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectForm;