import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { createTask, updateTask } from '../../store/slices/tasksSlice';
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '../../types';
import { formatDateForInput } from '../../utils/dateUtils';
import './TaskForm.scss';

interface TaskFormProps {
  projectNumber: number;
  task?: Task; // For editing existing task
  onClose: () => void;
  onSuccess?: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  projectNumber,
  task,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO' as TaskStatus,
    dueDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate ? formatDateForInput(task.dueDate) : '',
      });
    }
  }, [task]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (task) {
        // Update existing task
        const updateData: UpdateTaskRequest = {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          status: formData.status,
          dueDate: formData.dueDate || undefined,
        };

        const updatedTask = await dispatch(updateTask({
          projectNumber,
          taskNumber: task.taskNumber,
          taskData: updateData,
        })).unwrap();

        onSuccess?.(updatedTask);
      } else {
        // Create new task
        const createData: CreateTaskRequest = {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          status: formData.status,
          dueDate: formData.dueDate || undefined,
        };

        const newTask = await dispatch(createTask({
          projectNumber,
          taskData: createData,
        })).unwrap();

        onSuccess?.(newTask);
      }

      onClose();
    } catch (error: any) {
      console.error('Failed to save task:', error);
      if (error.message) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'Failed to save task. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content task-form-modal">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button 
            type="button" 
            className="btn-close"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter task title"
              disabled={isSubmitting}
              maxLength={200}
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Enter task description (optional)"
              disabled={isSubmitting}
              rows={4}
              maxLength={1000}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
            <div className="character-count">
              {formData.description.length}/1000
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="BLOCKED">Blocked</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className={`form-input ${errors.dueDate ? 'error' : ''}`}
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.dueDate && (
                <span className="error-message">{errors.dueDate}</span>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="form-group">
              <div className="error-message submit-error">
                {errors.submit}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  {task ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;