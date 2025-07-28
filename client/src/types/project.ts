export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold',
  ARCHIVED = 'archived'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ProjectCategory {
  PERSONAL = 'personal',
  WORK = 'work',
  LEARNING = 'learning',
  SIDE_PROJECT = 'side-project',
  CLIENT_WORK = 'client-work',
  OPEN_SOURCE = 'open-source'
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  joinedAt: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  tasks: {
    title: string;
    description?: string;
    estimatedHours?: number;
    dependencies?: number[];
  }[];
  estimatedDuration: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  category: ProjectCategory;
  progress: number; // 0-100
  startDate?: string;
  deadline?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  members: ProjectMember[];
  ownerId: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Calculated fields
  totalTasks?: number;
  completedTasks?: number;
  pendingTasks?: number;
  overdueTasks?: number;
  
  // Progress tracking metrics
  progressMetrics?: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    velocity: number;
    estimatedCompletion?: string;
    health: {
      isOnTrack: boolean;
      riskLevel: 'low' | 'medium' | 'high';
      completionTrend: 'ahead' | 'on-time' | 'behind';
      blockers: string[];
      recommendations: string[];
    };
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  color?: string;
  priority?: ProjectPriority;
  category?: ProjectCategory;
  startDate?: string;
  deadline?: string;
  estimatedHours?: number;
  tags?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  category?: ProjectCategory;
  startDate?: string;
  deadline?: string;
  estimatedHours?: number;
  tags?: string[];
  progress?: number;
}

export interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  filter: {
    status?: ProjectStatus[];
    priority?: ProjectPriority[];
    category?: ProjectCategory[];
    search?: string;
    tags?: string[];
    memberIds?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  sortBy: 'name' | 'createdAt' | 'deadline' | 'progress' | 'priority';
  sortOrder: 'asc' | 'desc';
  view: 'grid' | 'list' | 'timeline';
  showArchived: boolean;
  showProjectModal: boolean;
  showCreateProjectModal: boolean;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  archived: number;
  overdue: number;
  completionRate: number;
  averageProgress: number;
}

export interface ProjectTimeline {
  projectId: string;
  tasks: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    progress: number;
    dependencies: string[];
    assignees: string[];
  }[];
}

export interface ProjectProgress {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  progressPercentage: number;
  estimatedCompletion?: string;
  velocity?: number; // tasks per week
}

export interface ProjectFilter {
  statuses: ProjectStatus[];
  priorities: ProjectPriority[];
  categories: ProjectCategory[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search: string;
  tags: string[];
  memberIds: string[];
}


export interface ProjectsResponse {
  success: boolean;
  data: {
    projects: Project[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProjects: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ProjectResponse {
  success: boolean;
  message?: string;
  data: Project;
}