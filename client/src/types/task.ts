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
  projectId?: string;
  assigneeId?: string;
  estimatedHours?: number;
  actualHours?: number;
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
  projectId?: string;
  assigneeId?: string;
  estimatedHours?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  projectId?: string;
  assigneeId?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  tags?: string[];
  projectId?: string;
  assigneeId?: string;
  estimatedHours?: number;
}

export interface UpdateTaskData {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  projectId?: string;
  assigneeId?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export enum TaskFilter {
  ALL = 'all',
  COMPLETED = 'completed',
  PENDING = 'pending',
  HIGH_PRIORITY = 'high_priority',
  OVERDUE = 'overdue'
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface AdvancedSearchFilters {
  text?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  tags?: string[];
  createdDateRange?: DateRange;
  dueDateRange?: DateRange;
  isOverdue?: boolean;
}

export interface SavedSearchPreset {
  id: string;
  name: string;
  filters: AdvancedSearchFilters;
  isDefault?: boolean;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: AdvancedSearchFilters;
  timestamp: number;
}

export interface TasksState {
  tasks: Task[];
  filter: TaskFilter;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  advancedSearchFilters: AdvancedSearchFilters;
  savedSearchPresets: SavedSearchPreset[];
  searchHistory: SearchHistoryItem[];
  activeFiltersCount: number;
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

// Template system types
export enum TemplateCategory {
  CAREER = 'career',
  PERSONAL = 'personal',
  PROJECT = 'project',
  LEARNING = 'learning',
  BUSINESS = 'business',
  CUSTOM = 'custom'
}

export interface TemplateTask {
  title: string;
  description?: string;
  priority: TaskPriority;
  estimatedDuration?: string; // e.g., "2 hours", "1 day"
  tags?: string[];
  dependsOn?: number[]; // indices of dependent tasks
  isOptional?: boolean;
  defaultDueDate?: {
    days?: number; // days from template creation
    relative?: 'start' | 'previous_task'; // relative to template start or previous task completion
  };
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  tasks: TemplateTask[];
  isBuiltIn: boolean; // true for predefined templates, false for user-created
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
  estimatedTotalTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  author?: string; // for custom templates
}

export interface TemplatePreview {
  template: TaskTemplate;
  taskCount: number;
  estimatedDuration: string;
  categoryColor: string;
}

export interface CreateTemplateFromTasks {
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  taskIds: string[]; // existing task IDs to convert to template
}

export interface ApplyTemplateOptions {
  templateId: string;
  projectName?: string; // optional project context
  startDate?: Date; // when to start the template tasks
  customizations?: {
    taskOverrides?: { [taskIndex: number]: Partial<TemplateTask> };
    skipOptional?: boolean;
    adjustDueDates?: boolean;
  };
}

export interface TemplatesState {
  templates: TaskTemplate[];
  categories: TemplateCategory[];
  loading: boolean;
  error: string | null;
  selectedTemplate: TaskTemplate | null;
  showTemplateModal: boolean;
  showCreateTemplateModal: boolean;
  popularTemplates: TaskTemplate[];
  recentlyUsed: TaskTemplate[];
}