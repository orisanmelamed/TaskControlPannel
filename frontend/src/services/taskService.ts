import { apiClient } from './api';
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest 
} from '../types';

class TaskService {
  /**
   * Get all tasks for a specific project
   */
  async getTasks(projectNumber: number): Promise<Task[]> {
    try {
      const response = await apiClient.get<Task[]>(`/projects/${projectNumber}/tasks`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Get a specific task by task number within a project
   */
  async getTask(projectNumber: number, taskNumber: number): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(`/projects/${projectNumber}/tasks/${taskNumber}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch task';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Create a new task in a project
   */
  async createTask(projectNumber: number, data: CreateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(`/projects/${projectNumber}/tasks`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create task';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Update a task by task number within a project
   */
  async updateTask(projectNumber: number, taskNumber: number, data: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(`/projects/${projectNumber}/tasks/${taskNumber}`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update task';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Delete a task by task number within a project
   */
  async deleteTask(projectNumber: number, taskNumber: number): Promise<void> {
    try {
      await apiClient.delete(`/projects/${projectNumber}/tasks/${taskNumber}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete task';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Update task status (quick action)
   */
  async updateTaskStatus(projectNumber: number, taskNumber: number, status: string): Promise<Task> {
    return this.updateTask(projectNumber, taskNumber, { status: status as any });
  }

  /**
   * Update task position (for drag & drop reordering)
   */
  async updateTaskPosition(projectNumber: number, taskNumber: number, position: number): Promise<Task> {
    return this.updateTask(projectNumber, taskNumber, { position });
  }
}

// Export singleton instance
export const taskService = new TaskService();
export default taskService;