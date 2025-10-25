import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchTasks,
  setFilterStatus,
  selectFilteredAndSortedTasksByProject,
  selectTasksLoading,
  selectTasksError,
  selectFilterStatus,
  selectTaskStatsByProject,
} from '../../store/slices/tasksSlice';
import { Task, TaskStatus } from '../../types';
import TaskItem from './TaskItem.js';
import './TaskList.scss';

interface TaskListProps {
  projectNumber: number;
  showHeader?: boolean;
  maxTasks?: number;
  onEditTask?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  projectNumber, 
  showHeader = true,
  maxTasks,
  onEditTask
}) => {
  const dispatch = useAppDispatch();
  
  // Redux state - use project-specific selectors
  const tasks = useAppSelector(state => selectFilteredAndSortedTasksByProject(projectNumber)(state));
  const isLoading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  const filterStatus = useAppSelector(selectFilterStatus);
  const taskStats = useAppSelector(state => selectTaskStatsByProject(projectNumber)(state));

  // Load tasks when component mounts or project changes
  useEffect(() => {
    dispatch(fetchTasks(projectNumber));
  }, [dispatch, projectNumber]);

  const handleFilterChange = (status: TaskStatus | 'ALL') => {
    dispatch(setFilterStatus(status));
  };

  const displayTasks = maxTasks ? tasks.slice(0, maxTasks) : tasks;

  if (isLoading) {
    return (
      <div className="task-list">
        {showHeader && (
          <div className="task-list-header">
            <h3>Tasks</h3>
          </div>
        )}
        <div className="task-list-loading">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list">
        {showHeader && (
          <div className="task-list-header">
            <h3>Tasks</h3>
          </div>
        )}
        <div className="task-list-error">
          <p>Error loading tasks: {error}</p>
          <button 
            onClick={() => dispatch(fetchTasks(projectNumber))}
            className="btn btn-secondary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {showHeader && (
        <div className="task-list-header">
          <div className="header-left">
            <h3>Tasks ({taskStats.total})</h3>
            {taskStats.total > 0 && (
              <div className="task-stats">
                <span className="stat-item completed">
                  {taskStats.completed} completed
                </span>
                <span className="stat-item in-progress">
                  {taskStats.inProgress} in progress
                </span>
                {taskStats.blocked > 0 && (
                  <span className="stat-item blocked">
                    {taskStats.blocked} blocked
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="header-right">
            <div className="task-filters">
              <button
                className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
                onClick={() => handleFilterChange('ALL')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filterStatus === 'TODO' ? 'active' : ''}`}
                onClick={() => handleFilterChange('TODO')}
              >
                To Do
              </button>
              <button
                className={`filter-btn ${filterStatus === 'IN_PROGRESS' ? 'active' : ''}`}
                onClick={() => handleFilterChange('IN_PROGRESS')}
              >
                In Progress
              </button>
              <button
                className={`filter-btn ${filterStatus === 'BLOCKED' ? 'active' : ''}`}
                onClick={() => handleFilterChange('BLOCKED')}
              >
                Blocked
              </button>
              <button
                className={`filter-btn ${filterStatus === 'DONE' ? 'active' : ''}`}
                onClick={() => handleFilterChange('DONE')}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="task-list-content">
        {tasks.length === 0 ? (
          <div className="task-list-empty">
            <div className="empty-content">
              <h4>No tasks yet</h4>
              <p>
                {filterStatus === 'ALL' 
                  ? 'Get started by creating your first task for this project.'
                  : `No tasks with status "${filterStatus.toLowerCase().replace('_', ' ')}".`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="task-items">
            {displayTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                projectNumber={projectNumber}
                onEdit={onEditTask}
              />
            ))}
            {maxTasks && tasks.length > maxTasks && (
              <div className="task-list-more">
                <p>
                  Showing {maxTasks} of {tasks.length} tasks
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;