import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import {
  updateTaskStatus,
  deleteTask,
} from '../../store/slices/tasksSlice';
import { Task, TaskStatus } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  projectNumber: number;
  onEdit?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  projectNumber,
  onEdit
}) => {
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'TODO':
        return 'todo';
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'BLOCKED':
        return 'blocked';
      case 'DONE':
        return 'done';
      default:
        return 'todo';
    }
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case 'TODO':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'BLOCKED':
        return 'Blocked';
      case 'DONE':
        return 'Done';
      default:
        return status;
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await dispatch(updateTaskStatus({
        projectNumber,
        taskNumber: task.taskNumber,
        status: newStatus,
      })).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await dispatch(deleteTask({
        projectNumber,
        taskNumber: task.taskNumber,
      })).unwrap();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setShowDeleteConfirm(false);
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <div className={`task-item ${getStatusColor(task.status)} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-item-content">
        <div className="task-header">
          <div className="task-info">
            <div className="task-title-row">
              <h4 className="task-title">{task.title}</h4>
              <span className="task-number">#{task.taskNumber}</span>
            </div>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </div>
          
          <div className="task-actions">
            <div className="status-dropdown">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                className={`status-select ${getStatusColor(task.status)}`}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="BLOCKED">Blocked</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            
            {onEdit && (
              <button
                className="btn-icon btn-edit"
                onClick={() => onEdit(task)}
                title="Edit Task"
              >
                ✏️
              </button>
            )}
            
            <button
              className="btn-icon btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete Task"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="task-meta">
          <div className="task-meta-left">
            <span className={`task-status ${getStatusColor(task.status)}`}>
              {getStatusLabel(task.status)}
            </span>
            {task.dueDate && (
              <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                Due: {formatDate(task.dueDate)}
              </span>
            )}
          </div>
          
          <div className="task-meta-right">
            <span className="task-created">
              Created {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Task</h3>
            <p>
              Are you sure you want to delete "{task.title}"? 
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteTask}
                className="btn btn-danger"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;