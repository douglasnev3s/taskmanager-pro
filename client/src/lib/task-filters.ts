import { Task, AdvancedSearchFilters, TaskStatus, TaskPriority } from '@/types';
import { hasSearchMatch } from './search-highlight';
import { isWithinInterval, isAfter, isBefore, isToday, endOfDay, startOfDay } from 'date-fns';

export function applyAdvancedFilters(tasks: Task[], filters: AdvancedSearchFilters): Task[] {
  return tasks.filter(task => {
    // Text search - search in title, description, and tags
    if (filters.text && filters.text.trim()) {
      const searchText = filters.text.trim();
      const hasTextMatch = 
        hasSearchMatch(task.title, searchText) ||
        (task.description && hasSearchMatch(task.description, searchText)) ||
        (task.tags && task.tags.some(tag => hasSearchMatch(tag, searchText)));
      
      if (!hasTextMatch) return false;
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(filterTag => 
        task.tags && task.tags.includes(filterTag)
      );
      if (!hasMatchingTag) return false;
    }

    // Created date range filter
    if (filters.createdDateRange) {
      const createdDate = new Date(task.createdAt);
      const { from, to } = filters.createdDateRange;
      
      if (from && to) {
        if (!isWithinInterval(createdDate, { 
          start: startOfDay(from), 
          end: endOfDay(to) 
        })) return false;
      } else if (from) {
        if (isBefore(createdDate, startOfDay(from))) return false;
      } else if (to) {
        if (isAfter(createdDate, endOfDay(to))) return false;
      }
    }

    // Due date range filter
    if (filters.dueDateRange && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const { from, to } = filters.dueDateRange;
      
      if (from && to) {
        if (!isWithinInterval(dueDate, { 
          start: startOfDay(from), 
          end: endOfDay(to) 
        })) return false;
      } else if (from) {
        if (isBefore(dueDate, startOfDay(from))) return false;
      } else if (to) {
        if (isAfter(dueDate, endOfDay(to))) return false;
      }
    }

    // Overdue filter
    if (filters.isOverdue) {
      const isTaskOverdue = task.dueDate && 
        new Date(task.dueDate) < new Date() && 
        task.status !== TaskStatus.COMPLETED;
      
      if (!isTaskOverdue) return false;
    }

    return true;
  });
}

export function getFilteredTasksCount(tasks: Task[], filters: AdvancedSearchFilters): number {
  return applyAdvancedFilters(tasks, filters).length;
}

export function hasActiveFilters(filters: AdvancedSearchFilters): boolean {
  return Object.keys(filters).some(key => {
    const value = filters[key as keyof AdvancedSearchFilters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  });
}

export function getActiveFiltersCount(filters: AdvancedSearchFilters): number {
  return Object.keys(filters).filter(key => {
    const value = filters[key as keyof AdvancedSearchFilters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  }).length;
}

export function getAllUniqueTags(tasks: Task[]): string[] {
  const tagsSet = new Set<string>();
  tasks.forEach(task => {
    if (task.tags) {
      task.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
}

export function getTaskStatistics(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const inProgress = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const todo = tasks.filter(task => task.status === TaskStatus.TODO).length;
  const overdue = tasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    task.status !== TaskStatus.COMPLETED
  ).length;
  const highPriority = tasks.filter(task => task.priority === TaskPriority.HIGH).length;

  return {
    total,
    completed,
    inProgress,
    todo,
    overdue,
    highPriority,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function createTodayTasksFilter(): AdvancedSearchFilters {
  const today = new Date().toISOString().split('T')[0];
  return {
    dueDateRange: {
      from: today,
      to: today,
    },
  };
}

export function createThisWeekTasksFilter(): AdvancedSearchFilters {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return {
    dueDateRange: {
      from: today,
      to: nextWeek,
    },
  };
}

export function createOverdueTasksFilter(): AdvancedSearchFilters {
  return {
    isOverdue: true,
  };
}

export function createHighPriorityTasksFilter(): AdvancedSearchFilters {
  return {
    priority: [TaskPriority.HIGH],
  };
}