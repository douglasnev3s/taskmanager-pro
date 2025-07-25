import { createSelector } from '@reduxjs/toolkit';

import { TaskFilter, TaskStatus, TaskPriority } from '@/types/task';

import { RootState } from '../index';

// Base selectors
const selectTasksState = (state: RootState) => state.tasks;

// Tasks selectors
export const selectAllTasks = createSelector(
  selectTasksState,
  (tasksState) => tasksState.tasks
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (tasksState) => tasksState.loading
);

export const selectTasksError = createSelector(
  selectTasksState,
  (tasksState) => tasksState.error
);

export const selectCurrentFilter = createSelector(
  selectTasksState,
  (tasksState) => tasksState.filter
);

export const selectSearchQuery = createSelector(
  selectTasksState,
  (tasksState) => tasksState.searchQuery
);

// Filtered tasks selector
export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectCurrentFilter, selectSearchQuery],
  (tasks, filter, searchQuery) => {
    let filteredTasks = tasks;

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    switch (filter) {
      case TaskFilter.COMPLETED:
        return filteredTasks.filter(task => task.status === TaskStatus.COMPLETED);
      case TaskFilter.PENDING:
        return filteredTasks.filter(task => task.status !== TaskStatus.COMPLETED);
      
      case TaskFilter.HIGH_PRIORITY:
        return filteredTasks.filter(task => task.priority === TaskPriority.HIGH);
      
      case TaskFilter.OVERDUE:
        return filteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          const now = new Date();
          return dueDate < now && task.status !== TaskStatus.COMPLETED;
        });
      
      case TaskFilter.ALL:
      default:
        return filteredTasks;
    }
  }
);

export const selectTasksStats = createSelector([selectAllTasks], (tasks) => {
  return {
    total: tasks.length,
    completed: tasks.filter(task => task.status === TaskStatus.COMPLETED).length,
    inProgress: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length,
    todo: tasks.filter(task => task.status === TaskStatus.TODO).length,
    highPriority: tasks.filter(task => task.priority === TaskPriority.HIGH).length,
    overdue: tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      return dueDate < now && task.status !== TaskStatus.COMPLETED;
    }).length,
  };
});

// Task by priority selectors
export const selectTasksByPriority = createSelector(
  selectAllTasks,
  (tasks) => ({
    high: tasks.filter(task => task.priority === TaskPriority.HIGH),
    medium: tasks.filter(task => task.priority === TaskPriority.MEDIUM),
    low: tasks.filter(task => task.priority === TaskPriority.LOW),
  })
);

// Recent tasks selector (last 5 updated)
export const selectRecentTasks = createSelector(
  selectAllTasks,
  (tasks) => 
    [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
);

// Find task by ID
export const selectTaskById = (taskId: string) =>
  createSelector(
    selectAllTasks,
    (tasks) => tasks.find(task => task.id === taskId)
  );

// Upcoming tasks (next 7 days)
export const selectUpcomingTasks = createSelector(
  selectAllTasks,
  (tasks) => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return tasks
    .filter(task => {
      if (!task.dueDate || task.status === TaskStatus.COMPLETED) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= threeDaysFromNow;
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  }
);