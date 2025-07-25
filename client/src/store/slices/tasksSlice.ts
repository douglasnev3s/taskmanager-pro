import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { 
  Task, 
  TasksState, 
  TaskFilter, 
  CreateTaskData, 
  UpdateTaskData, 
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksResponse,
  ApiError,
  TaskStatus,
  TaskPriority
} from '@/types';
import { taskApiWithRetry } from '@/lib/api-client';

// Fetch tasks parameters interface
interface FetchTasksParams {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Async thunks
export const fetchTasks = createAsyncThunk<
  TasksResponse['data'],
  FetchTasksParams | undefined,
  { rejectValue: ApiError }
>('tasks/fetchTasks', async (params, { rejectWithValue }) => {
  try {
    const response = await taskApiWithRetry.getTasks(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to fetch tasks',
      status: error.status,
      data: error.data,
      isNetworkError: error.isNetworkError,
      isTimeoutError: error.isTimeoutError,
    });
  }
});

export const createTask = createAsyncThunk<
  Task,
  CreateTaskData,
  { rejectValue: ApiError }
>('tasks/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const createRequest: CreateTaskRequest = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: TaskStatus.TODO,
      dueDate: taskData.dueDate,
      tags: taskData.tags,
    };
    
    const response = await taskApiWithRetry.createTask(createRequest);
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to create task',
      status: error.status,
      data: error.data,
      isNetworkError: error.isNetworkError,
      isTimeoutError: error.isTimeoutError,
    });
  }
});

export const updateTask = createAsyncThunk<
  Task,
  UpdateTaskData,
  { rejectValue: ApiError }
>('tasks/updateTask', async (taskData, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = taskData;
    const updateRequest: UpdateTaskRequest = updateData;
    
    const response = await taskApiWithRetry.updateTask(id, updateRequest);
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to update task',
      status: error.status,
      data: error.data,
      isNetworkError: error.isNetworkError,
      isTimeoutError: error.isTimeoutError,
    });
  }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    await taskApiWithRetry.deleteTask(taskId);
    return taskId;
  } catch (error: any) {
    return rejectWithValue({
      message: error.message || 'Failed to delete task',
      status: error.status,
      data: error.data,
      isNetworkError: error.isNetworkError,
      isTimeoutError: error.isTimeoutError,
    });
  }
});

// Initial state
const initialState: TasksState = {
  tasks: [],
  filter: TaskFilter.ALL,
  loading: false,
  error: null,
  searchQuery: '',
  pagination: undefined,
};

// Tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TaskFilter>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleTaskComplete: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.status = task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;
        task.updatedAt = new Date().toISOString();
      }
    },
    addTaskLocal: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
    },
    updateTaskLocal: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTaskLocal: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    resetTasks: (state) => {
      state.tasks = [];
      state.filter = TaskFilter.ALL;
      state.searchQuery = '';
      state.error = null;
    },
    // Optimistic updates
    optimisticUpdateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        Object.assign(task, updates);
        task.updatedAt = new Date().toISOString();
      }
    },
    optimisticDeleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    },
    revertOptimisticUpdate: (state, action: PayloadAction<Task[]>) => {
      // Revert to the previous state if optimistic update fails
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch tasks';
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create task';
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update task';
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete task';
      });
  },
});

export const {
  setFilter,
  setSearchQuery,
  toggleTaskComplete,
  addTaskLocal,
  updateTaskLocal,
  removeTaskLocal,
  clearError,
  resetTasks,
  optimisticUpdateTask,
  optimisticDeleteTask,
  revertOptimisticUpdate,
} = tasksSlice.actions;

export default tasksSlice.reducer;