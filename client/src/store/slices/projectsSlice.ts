import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Project, 
  ProjectsState, 
  ProjectStatus,
  ProjectPriority,
  ProjectCategory,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectFilter,
  ProjectStats,
  Task
} from '@/types';
import { 
  calculateProjectProgress, 
  calculateProjectHealth, 
  updateProjectProgressAutomatically,
  ProjectProgressCalculation,
  ProjectHealthMetrics
} from '@/lib/projectProgress';

// Mock API functions (will be replaced with real API calls later)
const projectApi = {
  getProjects: async (): Promise<Project[]> => {
    // Return mock projects for now
    return [];
  },
  createProject: async (project: CreateProjectRequest): Promise<Project> => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: project.name,
      description: project.description,
      color: project.color || '#3B82F6',
      status: ProjectStatus.ACTIVE,
      priority: project.priority || ProjectPriority.MEDIUM,
      category: project.category || ProjectCategory.PERSONAL,
      progress: 0,
      startDate: project.startDate,
      deadline: project.deadline,
      estimatedHours: project.estimatedHours,
      tags: project.tags || [],
      members: [],
      ownerId: 'current-user',
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newProject;
  },
  updateProject: async (id: string, updates: UpdateProjectRequest): Promise<Project> => {
    // Mock implementation
    throw new Error('Not implemented');
  },
  deleteProject: async (id: string): Promise<void> => {
    // Mock implementation
  },
  archiveProject: async (id: string): Promise<Project> => {
    // Mock implementation
    throw new Error('Not implemented');
  },
  restoreProject: async (id: string): Promise<Project> => {
    // Mock implementation
    throw new Error('Not implemented');
  }
};

// Async thunks
export const fetchProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: string }
>('projects/fetchProjects', async (_, { rejectWithValue }) => {
  try {
    return await projectApi.getProjects();
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch projects');
  }
});

export const createProject = createAsyncThunk<
  Project,
  CreateProjectRequest,
  { rejectValue: string }
>('projects/createProject', async (projectData, { rejectWithValue }) => {
  try {
    return await projectApi.createProject(projectData);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to create project');
  }
});

export const updateProject = createAsyncThunk<
  Project,
  { id: string; updates: UpdateProjectRequest },
  { rejectValue: string }
>('projects/updateProject', async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await projectApi.updateProject(id, updates);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update project');
  }
});

export const deleteProject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('projects/deleteProject', async (projectId, { rejectWithValue }) => {
  try {
    await projectApi.deleteProject(projectId);
    return projectId;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete project');
  }
});

export const archiveProject = createAsyncThunk<
  Project,
  string,
  { rejectValue: string }
>('projects/archiveProject', async (projectId, { rejectWithValue }) => {
  try {
    return await projectApi.archiveProject(projectId);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to archive project');
  }
});

export const restoreProject = createAsyncThunk<
  Project,
  string,
  { rejectValue: string }
>('projects/restoreProject', async (projectId, { rejectWithValue }) => {
  try {
    return await projectApi.restoreProject(projectId);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to restore project');
  }
});

// Default project colors
const defaultColors = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280'  // Gray
];

// Helper function to get random color
const getRandomColor = () => {
  return defaultColors[Math.floor(Math.random() * defaultColors.length)];
};

// Helper function to calculate project progress
const calculateProgress = (project: Project, tasks: any[] = []): number => {
  const projectTasks = tasks.filter(task => task.projectId === project.id);
  if (projectTasks.length === 0) return 0;
  
  const completedTasks = projectTasks.filter(task => task.status === 'completed');
  return Math.round((completedTasks.length / projectTasks.length) * 100);
};

// Default mock projects for development
const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'TaskManager Pro Development',
    description: 'Building the ultimate task management application',
    color: '#3B82F6',
    status: ProjectStatus.ACTIVE,
    priority: ProjectPriority.HIGH,
    category: ProjectCategory.SIDE_PROJECT,
    progress: 75,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 200,
    actualHours: 150,
    tags: ['development', 'react', 'typescript'],
    members: [],
    ownerId: 'current-user',
    isArchived: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-2', 
    name: 'Job Search 2024',
    description: 'Finding my next software engineering opportunity',
    color: '#10B981',
    status: ProjectStatus.ACTIVE,
    priority: ProjectPriority.CRITICAL,
    category: ProjectCategory.PERSONAL,
    progress: 45,
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 80,
    actualHours: 36,
    tags: ['career', 'job-search', 'networking'],
    members: [],
    ownerId: 'current-user',
    isArchived: false,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    name: 'React Learning Path',
    description: 'Master advanced React concepts and patterns',
    color: '#F59E0B',
    status: ProjectStatus.ACTIVE,
    priority: ProjectPriority.MEDIUM,
    category: ProjectCategory.LEARNING,
    progress: 30,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 100,
    actualHours: 30,
    tags: ['learning', 'react', 'frontend'],
    members: [],
    ownerId: 'current-user',
    isArchived: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Initial state
const initialState: ProjectsState = {
  projects: mockProjects,
  selectedProject: null,
  loading: false,
  error: null,
  filter: {
    search: '',
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  view: 'grid',
  showArchived: false,
  showProjectModal: false,
  showCreateProjectModal: false,
};

// Projects slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // UI state management
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    setShowProjectModal: (state, action: PayloadAction<boolean>) => {
      state.showProjectModal = action.payload;
      if (!action.payload) {
        state.selectedProject = null;
      }
    },
    setShowCreateProjectModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateProjectModal = action.payload;
    },
    
    // Filter and sort management
    setProjectFilter: (state, action: PayloadAction<Partial<ProjectFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearProjectFilter: (state) => {
      state.filter = { search: '' };
    },
    setSortBy: (state, action: PayloadAction<ProjectsState['sortBy']>) => {
      if (state.sortBy === action.payload) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = action.payload;
        state.sortOrder = 'asc';
      }
    },
    setProjectView: (state, action: PayloadAction<ProjectsState['view']>) => {
      state.view = action.payload;
    },
    setShowArchived: (state, action: PayloadAction<boolean>) => {
      state.showArchived = action.payload;
    },
    
    // Project management
    addProjectLocal: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload);
    },
    updateProjectLocal: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(project => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    removeProjectLocal: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
    },
    
    // Progress update
    updateProjectProgress: (state, action: PayloadAction<{ projectId: string; progress: number }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.progress = action.payload.progress;
        project.updatedAt = new Date().toISOString();
        
        // Auto-complete project when progress reaches 100%
        if (action.payload.progress === 100 && project.status !== ProjectStatus.COMPLETED) {
          project.status = ProjectStatus.COMPLETED;
          project.completedDate = new Date().toISOString();
        }
      }
    },
    
    // Automatic progress calculation when tasks change
    recalculateProjectProgress: (state, action: PayloadAction<{ 
      projectId: string; 
      tasks: Task[];
      project?: Project;
    }>) => {
      const { projectId, tasks, project } = action.payload;
      const targetProject = project || state.projects.find(p => p.id === projectId);
      
      if (targetProject) {
        const progressCalc = calculateProjectProgress(projectId, tasks, targetProject);
        const healthMetrics = calculateProjectHealth(progressCalc, targetProject);
        
        // Update project with calculated progress
        const projectIndex = state.projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          state.projects[projectIndex].progress = progressCalc.progressPercentage;
          state.projects[projectIndex].actualHours = progressCalc.actualHoursTotal;
          state.projects[projectIndex].updatedAt = new Date().toISOString();
          
          // Store progress metadata for dashboard insights
          state.projects[projectIndex].progressMetrics = {
            totalTasks: progressCalc.totalTasks,
            completedTasks: progressCalc.completedTasks,
            inProgressTasks: progressCalc.inProgressTasks,
            overdueTasks: progressCalc.overdueTasks,
            velocity: progressCalc.velocity,
            estimatedCompletion: progressCalc.estimatedCompletion,
            health: healthMetrics
          };
          
          // Auto-complete project when progress reaches 100%
          if (progressCalc.progressPercentage === 100 && state.projects[projectIndex].status !== ProjectStatus.COMPLETED) {
            state.projects[projectIndex].status = ProjectStatus.COMPLETED;
            state.projects[projectIndex].completedDate = new Date().toISOString();
          }
        }
      }
    },
    
    // Bulk operations
    bulkArchiveProjects: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(projectId => {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          project.isArchived = true;
          project.status = ProjectStatus.ARCHIVED;
          project.updatedAt = new Date().toISOString();
        }
      });
    },
    bulkRestoreProjects: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(projectId => {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          project.isArchived = false;
          project.status = ProjectStatus.ACTIVE;
          project.updatedAt = new Date().toISOString();
        }
      });
    },
    bulkDeleteProjects: (state, action: PayloadAction<string[]>) => {
      state.projects = state.projects.filter(
        project => !action.payload.includes(project.id)
      );
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
    
    // Project templates
    createProjectFromTemplate: (state, action: PayloadAction<{
      templateId: string;
      name: string;
      customizations?: Partial<CreateProjectRequest>;
    }>) => {
      const { name, customizations } = action.payload;
      
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name,
        description: customizations?.description || `Project created from template`,
        color: customizations?.color || getRandomColor(),
        status: ProjectStatus.ACTIVE,
        priority: customizations?.priority || ProjectPriority.MEDIUM,
        category: customizations?.category || ProjectCategory.PERSONAL,
        progress: 0,
        startDate: customizations?.startDate,
        deadline: customizations?.deadline,
        estimatedHours: customizations?.estimatedHours,
        tags: customizations?.tags || [],
        members: [],
        ownerId: 'current-user',
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      state.projects.unshift(newProject);
    },
  },
  extraReducers: (builder) => {
    // Fetch projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch projects';
      });

    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create project';
      });

    // Update project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update project';
      });

    // Delete project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(project => project.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete project';
      });

    // Archive project
    builder
      .addCase(archiveProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      });

    // Restore project
    builder
      .addCase(restoreProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      });
  },
});

export const {
  setSelectedProject,
  setShowProjectModal,
  setShowCreateProjectModal,
  setProjectFilter,
  clearProjectFilter,
  setSortBy,
  setProjectView,
  setShowArchived,
  addProjectLocal,
  updateProjectLocal,
  removeProjectLocal,
  updateProjectProgress,
  recalculateProjectProgress,
  bulkArchiveProjects,
  bulkRestoreProjects,
  bulkDeleteProjects,
  clearError,
  createProjectFromTemplate,
} = projectsSlice.actions;

export default projectsSlice.reducer;