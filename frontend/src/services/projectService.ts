import { apiClient } from './api';
import { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest 
} from '../types';

class ProjectService {
  /**
   * Get all projects for the current user
   */
  async getProjects(): Promise<Project[]> {
    try {
      const response = await apiClient.get<Project[]>('/projects');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch projects';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Get a specific project by project number
   */
  async getProject(projectNumber: number): Promise<Project> {
    try {
      const response = await apiClient.get<Project>(`/projects/${projectNumber}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch project';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectRequest): Promise<Project> {
    try {
      const response = await apiClient.post<Project>('/projects', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create project';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Update a project by project number
   */
  async updateProject(projectNumber: number, data: UpdateProjectRequest): Promise<Project> {
    try {
      const response = await apiClient.patch<Project>(`/projects/${projectNumber}`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update project';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Delete a project by project number
   */
  async deleteProject(projectNumber: number): Promise<void> {
    try {
      await apiClient.delete(`/projects/${projectNumber}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete project';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;