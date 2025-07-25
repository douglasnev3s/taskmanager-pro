import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { Task, TasksState, TaskFilter, CreateTaskData, UpdateTaskData, ApiResponse, ApiError } from '@/types';

// API base URL
const API_BASE_URL = '/api';

// Async thunks
export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: ApiError }
>('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<ApiResponse<Task[]>>(`${API_BASE_URL}/tasks`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to fetch tasks',
      status: error.response?.status || 500,
      details: error.response?.data,
    });
  }
});

export const createTask = createAsyncThunk<
  Task,
  CreateTaskData,
  { rejectValue: ApiError }
>('tasks/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await axios.post<ApiResponse<Task>>(`${API_BASE_URL}/tasks`, taskData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to create task',
      status: error.response?.status || 500,
      details: error.response?.data,
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
    const response = await axios.put<ApiResponse<Task>>(`${API_BASE_URL}/tasks/${id}`, updateData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to update task',
      status: error.response?.status || 500,
      details: error.response?.data,
    });
  }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    return taskId;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || 'Failed to delete task',
      status: error.response?.status || 500,
      details: error.response?.data,
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
        task.completed = !task.completed;
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
        state.tasks = action.payload;
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
} = tasksSlice.actions;

export default tasksSlice.reducer;