import { CreateTaskRequest, UpdateTaskRequest, TasksResponse, TaskResponse } from '@/types/task';

import api from './api';

// Task API Client
export const taskApi = {
  // Get all tasks with optional query parameters
  getTasks: async (params?: {
    page?: number;
    limit?: number;
    status?: 'todo' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    search?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
    sortOrder?: 'asc' | 'desc';
  }): Promise<TasksResponse> => {
    const response = await api.get<TasksResponse>('/tasks', { params });
    return response.data;
  },

  // Get single task by ID
  getTask: async (id: string): Promise<TaskResponse> => {
    const response = await api.get<TaskResponse>(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (task: CreateTaskRequest): Promise<TaskResponse> => {
    const response = await api.post<TaskResponse>('/tasks', task);
    return response.data;
  },

  // Update existing task
  updateTask: async (id: string, updates: UpdateTaskRequest): Promise<TaskResponse> => {
    const response = await api.put<TaskResponse>(`/tasks/${id}`, updates);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<TaskResponse> => {
    const response = await api.delete<TaskResponse>(`/tasks/${id}`);
    return response.data;
  },
};

// Retry logic utility
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
      
      console.warn(`🔄 Retrying request (attempt ${attempt + 1}/${maxRetries})`);
    }
  }
  
  throw lastError;
};

// Enhanced API client with retry logic
export const taskApiWithRetry = {
  getTasks: (params?: Parameters<typeof taskApi.getTasks>[0]) =>
    withRetry(() => taskApi.getTasks(params)),
  
  getTask: (id: string) =>
    withRetry(() => taskApi.getTask(id)),
  
  createTask: (task: CreateTaskRequest) =>
    withRetry(() => taskApi.createTask(task)),
  
  updateTask: (id: string, updates: UpdateTaskRequest) =>
    withRetry(() => taskApi.updateTask(id, updates)),
  
  deleteTask: (id: string) =>
    withRetry(() => taskApi.deleteTask(id)),
};

export default taskApi;