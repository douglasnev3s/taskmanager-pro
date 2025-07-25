import { Middleware } from '@reduxjs/toolkit';

import { showToast, formatApiError } from '@/lib/toast';

import { createTask, updateTask, deleteTask, fetchTasks } from '../slices/tasksSlice';

export const toastMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);

  // Handle async thunk fulfilled actions
  if (createTask.fulfilled.match(action)) {
    showToast.success('Task created successfully!');
  }

  if (updateTask.fulfilled.match(action)) {
    showToast.success('Task updated successfully!');
  }

  if (deleteTask.fulfilled.match(action)) {
    showToast.success('Task deleted successfully!');
  }

  // Handle async thunk rejected actions
  if (createTask.rejected.match(action)) {
    const errorMessage = action.payload ? formatApiError(action.payload) : 'Failed to create task';
    showToast.error(errorMessage);
  }

  if (updateTask.rejected.match(action)) {
    const errorMessage = action.payload ? formatApiError(action.payload) : 'Failed to update task';
    showToast.error(errorMessage);
  }

  if (deleteTask.rejected.match(action)) {
    const errorMessage = action.payload ? formatApiError(action.payload) : 'Failed to delete task';
    showToast.error(errorMessage);
  }

  if (fetchTasks.rejected.match(action)) {
    const errorMessage = action.payload ? formatApiError(action.payload) : 'Failed to fetch tasks';
    showToast.error(errorMessage);
  }

  return result;
};

export default toastMiddleware;