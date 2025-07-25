export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskData {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
}

export enum TaskFilter {
  ALL = 'all',
  COMPLETED = 'completed',
  PENDING = 'pending',
  HIGH_PRIORITY = 'high_priority',
  OVERDUE = 'overdue'
}

export interface TasksState {
  tasks: Task[];
  filter: TaskFilter;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTasks: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  data: Task;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
  isNetworkError?: boolean;
  isTimeoutError?: boolean;
  details?: Record<string, any>;
}