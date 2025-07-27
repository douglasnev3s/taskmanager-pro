import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { Task, TaskFilter, TaskStatus, TaskPriority } from '@/types';
import { applyAdvancedFilters, getTaskStatistics, getAllUniqueTags } from '@/lib/task-filters';

// Base selectors
export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTasksFilter = (state: RootState) => state.tasks.filter;
export const selectSearchQuery = (state: RootState) => state.tasks.searchQuery;
export const selectAdvancedSearchFilters = (state: RootState) => state.tasks.advancedSearchFilters;
export const selectSavedSearchPresets = (state: RootState) => state.tasks.savedSearchPresets;
export const selectSearchHistory = (state: RootState) => state.tasks.searchHistory;
export const selectActiveFiltersCount = (state: RootState) => state.tasks.activeFiltersCount;
export const selectPagination = (state: RootState) => state.tasks.pagination;

// Derived selectors
export const selectFilteredTasks = createSelector(
  [selectTasks, selectTasksFilter, selectSearchQuery, selectAdvancedSearchFilters],
  (tasks, filter, searchQuery, advancedFilters) => {
    let filteredTasks = tasks;

    // Apply basic filter first
    if (filter !== TaskFilter.ALL) {
      switch (filter) {
        case TaskFilter.COMPLETED:
          filteredTasks = filteredTasks.filter(task => task.status === TaskStatus.COMPLETED);
          break;
        case TaskFilter.PENDING:
          filteredTasks = filteredTasks.filter(task => task.status !== TaskStatus.COMPLETED);
          break;
        case TaskFilter.HIGH_PRIORITY:
          filteredTasks = filteredTasks.filter(task => task.priority === TaskPriority.HIGH);
          break;
        case TaskFilter.OVERDUE:
          filteredTasks = filteredTasks.filter(task => 
            task.dueDate && 
            new Date(task.dueDate) < new Date() && 
            task.status !== TaskStatus.COMPLETED
          );
          break;
      }
    }

    // Apply legacy search query if no advanced filters are active
    if (searchQuery && Object.keys(advancedFilters).length === 0) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Apply advanced filters
    if (Object.keys(advancedFilters).length > 0) {
      filteredTasks = applyAdvancedFilters(filteredTasks, advancedFilters);
    }

    return filteredTasks;
  }
);

export const selectTasksStatistics = createSelector(
  [selectFilteredTasks],
  (tasks) => getTaskStatistics(tasks)
);

export const selectAvailableTags = createSelector(
  [selectTasks],
  (tasks) => getAllUniqueTags(tasks)
);

export const selectTaskById = createSelector(
  [selectTasks, (_state: RootState, taskId: string) => taskId],
  (tasks, taskId) => tasks.find(task => task.id === taskId)
);

export const selectTasksByStatus = createSelector(
  [selectFilteredTasks],
  (tasks) => {
    return {
      todo: tasks.filter(task => task.status === TaskStatus.TODO),
      inProgress: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
      completed: tasks.filter(task => task.status === TaskStatus.COMPLETED),
    };
  }
);

export const selectTasksByPriority = createSelector(
  [selectFilteredTasks],
  (tasks) => {
    return {
      high: tasks.filter(task => task.priority === TaskPriority.HIGH),
      medium: tasks.filter(task => task.priority === TaskPriority.MEDIUM),
      low: tasks.filter(task => task.priority === TaskPriority.LOW),
    };
  }
);

export const selectOverdueTasks = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    task.status !== TaskStatus.COMPLETED
  )
);

export const selectUpcomingTasks = createSelector(
  [selectTasks],
  (tasks) => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) >= now && 
      new Date(task.dueDate) <= nextWeek &&
      task.status !== TaskStatus.COMPLETED
    );
  }
);

export const selectRecentTasks = createSelector(
  [selectTasks],
  (tasks) => {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return tasks
      .filter(task => new Date(task.createdAt) >= lastWeek)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }
);

export const selectHasActiveAdvancedFilters = createSelector(
  [selectAdvancedSearchFilters],
  (filters) => Object.keys(filters).length > 0
);

export const selectSearchSuggestions = createSelector(
  [selectAvailableTags, selectSearchHistory],
  (tags, history) => {
    const suggestions = new Set<string>();
    
    // Add recent search queries
    history.slice(0, 5).forEach(item => {
      if (item.query) suggestions.add(item.query);
    });
    
    // Add popular tags
    tags.slice(0, 10).forEach(tag => suggestions.add(tag));
    
    return Array.from(suggestions);
  }
);