export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  projectNumber: number;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  taskNumber: number;
  title: string;
  description?: string;
  status: TaskStatus;
  position: number;
  dueDate?: string;
  projectId: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  position?: number;
  dueDate?: string;
  assignedTo?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  position?: number;
  dueDate?: string;
  assignedTo?: string;
}