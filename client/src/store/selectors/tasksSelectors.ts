import { createSelector } from '@reduxjs/toolkit';

import { TaskFilter, TaskPriority } from '@/types';

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

    // Apply status filter
    switch (filter) {
      case TaskFilter.COMPLETED:
        return filteredTasks.filter(task => task.completed);
      
      case TaskFilter.PENDING:
        return filteredTasks.filter(task => !task.completed);
      
      case TaskFilter.HIGH_PRIORITY:
        return filteredTasks.filter(task => task.priority === TaskPriority.HIGH);
      
      case TaskFilter.OVERDUE:
        const now = new Date();
        return filteredTasks.filter(
          task => 
            !task.completed && 
            task.dueDate && 
            new Date(task.dueDate) < now
        );
      
      case TaskFilter.ALL:
      default:
        return filteredTasks;
    }
  }
);

// Task statistics selectors
export const selectTaskStats = createSelector(
  selectAllTasks,
  (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(task => task.priority === TaskPriority.HIGH).length;
    
    const now = new Date();
    const overdue = tasks.filter(
      task => 
        !task.completed && 
        task.dueDate && 
        new Date(task.dueDate) < now
    ).length;

    return {
      total,
      completed,
      pending,
      highPriority,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
);

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
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(
      task => 
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate) >= now &&
        new Date(task.dueDate) <= nextWeek
    );
  }
);