import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  TaskTemplate, 
  TemplatesState, 
  TemplateCategory, 
  ApplyTemplateOptions,
  CreateTemplateFromTasks,
  Task,
  TaskStatus,
  TemplateTask
} from '@/types';
import { BUILT_IN_TEMPLATES } from '@/data/templates';

// Async thunks for template operations
export const applyTemplate = createAsyncThunk<
  Task[],
  ApplyTemplateOptions,
  { rejectValue: string }
>('templates/applyTemplate', async (options, { rejectWithValue, getState }) => {
  try {
    const state = getState() as any;
    const template = state.templates.templates.find((t: TaskTemplate) => t.id === options.templateId);
    
    if (!template) {
      return rejectWithValue('Template not found');
    }

    const now = new Date();
    const startDate = options.startDate || now;
    
    // Convert template tasks to actual tasks
    const tasks: Task[] = template.tasks.map((templateTask: TemplateTask, index: number) => {
      // Calculate due date
      let dueDate: string | undefined;
      if (templateTask.defaultDueDate) {
        const dueDateCalc = new Date(startDate);
        dueDateCalc.setDate(dueDateCalc.getDate() + (templateTask.defaultDueDate.days || 0));
        dueDate = dueDateCalc.toISOString();
      }

      // Apply customizations if provided
      const customization = options.customizations?.taskOverrides?.[index];
      
      return {
        id: `temp-${Date.now()}-${index}`, // Temporary ID, will be replaced when saved to backend
        title: customization?.title || templateTask.title,
        description: customization?.description || templateTask.description || '',
        status: TaskStatus.TODO,
        priority: customization?.priority || templateTask.priority,
        dueDate,
        tags: [
          ...(customization?.tags || templateTask.tags || []),
          ...(options.projectName ? [options.projectName] : []),
          `template:${template.name}`.toLowerCase().replace(/\s+/g, '-')
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
    });

    // Filter out optional tasks if requested
    if (options.customizations?.skipOptional) {
      return tasks.filter((_, index) => !template.tasks[index].isOptional);
    }

    return tasks;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to apply template');
  }
});

export const createTemplateFromTasks = createAsyncThunk<
  TaskTemplate,
  CreateTemplateFromTasks & { tasks: Task[] },
  { rejectValue: string }
>('templates/createTemplateFromTasks', async (data, { rejectWithValue }) => {
  try {
    const { tasks, taskIds, ...templateData } = data;
    
    // Convert selected tasks to template tasks
    const templateTasks = tasks
      .filter(task => taskIds.includes(task.id))
      .map(task => ({
        title: task.title,
        description: task.description,
        priority: task.priority,
        tags: task.tags,
        isOptional: false
      }));

    const newTemplate: TaskTemplate = {
      id: `custom-${Date.now()}`,
      ...templateData,
      tasks: templateTasks,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      author: 'User', // In a real app, this would be the logged-in user
      estimatedTotalTime: `${templateTasks.length} tasks`
    };

    return newTemplate;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to create template');
  }
});

// Initial state
const initialState: TemplatesState = {
  templates: BUILT_IN_TEMPLATES,
  categories: Object.values(TemplateCategory),
  loading: false,
  error: null,
  selectedTemplate: null,
  showTemplateModal: false,
  showCreateTemplateModal: false,
  popularTemplates: [],
  recentlyUsed: []
};

// Templates slice
const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    // Template selection and UI state
    setSelectedTemplate: (state, action: PayloadAction<TaskTemplate | null>) => {
      state.selectedTemplate = action.payload;
    },
    setShowTemplateModal: (state, action: PayloadAction<boolean>) => {
      state.showTemplateModal = action.payload;
      if (!action.payload) {
        state.selectedTemplate = null;
      }
    },
    setShowCreateTemplateModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateTemplateModal = action.payload;
    },
    
    // Template management
    addTemplate: (state, action: PayloadAction<TaskTemplate>) => {
      state.templates.push(action.payload);
    },
    removeTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter(template => template.id !== action.payload);
    },
    updateTemplate: (state, action: PayloadAction<TaskTemplate>) => {
      const index = state.templates.findIndex(template => template.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
    
    // Usage tracking
    incrementTemplateUsage: (state, action: PayloadAction<string>) => {
      const template = state.templates.find(t => t.id === action.payload);
      if (template) {
        template.usageCount = (template.usageCount || 0) + 1;
        template.updatedAt = new Date().toISOString();
        
        // Add to recently used (remove if exists, then add to front)
        state.recentlyUsed = state.recentlyUsed.filter(t => t.id !== template.id);
        state.recentlyUsed.unshift(template);
        state.recentlyUsed = state.recentlyUsed.slice(0, 5); // Keep only 5 most recent
      }
    },
    
    // Popular templates calculation
    updatePopularTemplates: (state) => {
      state.popularTemplates = [...state.templates]
        .filter(template => template.usageCount && template.usageCount > 0)
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 6);
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
    
    // Template duplication
    duplicateTemplate: (state, action: PayloadAction<string>) => {
      const original = state.templates.find(t => t.id === action.payload);
      if (original) {
        const duplicate: TaskTemplate = {
          ...original,
          id: `${original.id}-copy-${Date.now()}`,
          name: `${original.name} (Copy)`,
          isBuiltIn: false,
          usageCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'User'
        };
        state.templates.push(duplicate);
      }
    }
  },
  extraReducers: (builder) => {
    // Apply template
    builder
      .addCase(applyTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // The tasks are handled by the tasks slice, we just track usage here
        if (state.selectedTemplate) {
          templatesSlice.caseReducers.incrementTemplateUsage(state, {
            type: 'incrementTemplateUsage',
            payload: state.selectedTemplate.id
          });
        }
      })
      .addCase(applyTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to apply template';
      });

    // Create template from tasks
    builder
      .addCase(createTemplateFromTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplateFromTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
        state.error = null;
      })
      .addCase(createTemplateFromTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create template';
      });
  }
});

export const {
  setSelectedTemplate,
  setShowTemplateModal,
  setShowCreateTemplateModal,
  addTemplate,
  removeTemplate,
  updateTemplate,
  incrementTemplateUsage,
  updatePopularTemplates,
  clearError,
  duplicateTemplate
} = templatesSlice.actions;

export default templatesSlice.reducer;