import { AdvancedSearchFilters, TaskStatus, TaskPriority } from '@/types';

export interface URLSearchParams {
  text?: string;
  status?: string[];
  priority?: string[];
  tags?: string[];
  createdFrom?: string;
  createdTo?: string;
  dueFrom?: string;
  dueTo?: string;
  overdue?: string;
  preset?: string;
}

export function encodeFiltersToURL(filters: AdvancedSearchFilters): URLSearchParams {
  const params: URLSearchParams = {};

  if (filters.text) {
    params.text = filters.text;
  }

  if (filters.status && filters.status.length > 0) {
    params.status = filters.status;
  }

  if (filters.priority && filters.priority.length > 0) {
    params.priority = filters.priority;
  }

  if (filters.tags && filters.tags.length > 0) {
    params.tags = filters.tags;
  }

  if (filters.createdDateRange) {
    if (filters.createdDateRange.from) {
      params.createdFrom = filters.createdDateRange.from;
    }
    if (filters.createdDateRange.to) {
      params.createdTo = filters.createdDateRange.to;
    }
  }

  if (filters.dueDateRange) {
    if (filters.dueDateRange.from) {
      params.dueFrom = filters.dueDateRange.from;
    }
    if (filters.dueDateRange.to) {
      params.dueTo = filters.dueDateRange.to;
    }
  }

  if (filters.isOverdue) {
    params.overdue = 'true';
  }

  return params;
}

export function decodeFiltersFromURL(searchParams: URLSearchParams): AdvancedSearchFilters {
  const filters: AdvancedSearchFilters = {};

  if (searchParams.text) {
    filters.text = searchParams.text;
  }

  if (searchParams.status && searchParams.status.length > 0) {
    filters.status = searchParams.status.filter(status => 
      Object.values(TaskStatus).includes(status as TaskStatus)
    ) as TaskStatus[];
  }

  if (searchParams.priority && searchParams.priority.length > 0) {
    filters.priority = searchParams.priority.filter(priority => 
      Object.values(TaskPriority).includes(priority as TaskPriority)
    ) as TaskPriority[];
  }

  if (searchParams.tags && searchParams.tags.length > 0) {
    filters.tags = searchParams.tags;
  }

  if (searchParams.createdFrom || searchParams.createdTo) {
    filters.createdDateRange = {};
    if (searchParams.createdFrom) {
      const date = new Date(searchParams.createdFrom);
      if (!isNaN(date.getTime())) {
        filters.createdDateRange.from = date.toISOString().split('T')[0];
      }
    }
    if (searchParams.createdTo) {
      const date = new Date(searchParams.createdTo);
      if (!isNaN(date.getTime())) {
        filters.createdDateRange.to = date.toISOString().split('T')[0];
      }
    }
  }

  if (searchParams.dueFrom || searchParams.dueTo) {
    filters.dueDateRange = {};
    if (searchParams.dueFrom) {
      const date = new Date(searchParams.dueFrom);
      if (!isNaN(date.getTime())) {
        filters.dueDateRange.from = date.toISOString().split('T')[0];
      }
    }
    if (searchParams.dueTo) {
      const date = new Date(searchParams.dueTo);
      if (!isNaN(date.getTime())) {
        filters.dueDateRange.to = date.toISOString().split('T')[0];
      }
    }
  }

  if (searchParams.overdue === 'true') {
    filters.isOverdue = true;
  }

  return filters;
}

export function createShareableURL(
  baseURL: string, 
  filters: AdvancedSearchFilters,
  additionalParams?: Record<string, string>
): string {
  const url = new URL(baseURL);
  const encodedFilters = encodeFiltersToURL(filters);

  // Add filter parameters
  Object.entries(encodedFilters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => url.searchParams.append(key, item));
    } else if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  });

  // Add additional parameters
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

export function parseURLSearchParams(urlSearchParams: Record<string, string | string[]>): URLSearchParams {
  const params: URLSearchParams = {};

  // Handle array parameters
  const arrayParams = ['status', 'priority', 'tags'];
  arrayParams.forEach(param => {
    const values = urlSearchParams[param];
    if (values) {
      if (Array.isArray(values)) {
        (params as any)[param] = values;
      } else {
        (params as any)[param] = [values];
      }
    }
  });

  // Handle string parameters
  const stringParams = ['text', 'createdFrom', 'createdTo', 'dueFrom', 'dueTo', 'overdue', 'preset'];
  stringParams.forEach(param => {
    const value = urlSearchParams[param];
    if (typeof value === 'string') {
      (params as any)[param] = value;
    }
  });

  return params;
}

export function getFilterDescription(filters: AdvancedSearchFilters): string {
  const descriptions: string[] = [];

  if (filters.text) {
    descriptions.push(`Search: "${filters.text}"`);
  }

  if (filters.status && filters.status.length > 0) {
    descriptions.push(`Status: ${filters.status.join(', ')}`);
  }

  if (filters.priority && filters.priority.length > 0) {
    descriptions.push(`Priority: ${filters.priority.join(', ')}`);
  }

  if (filters.tags && filters.tags.length > 0) {
    descriptions.push(`Tags: ${filters.tags.join(', ')}`);
  }

  if (filters.createdDateRange) {
    const { from, to } = filters.createdDateRange;
    if (from && to) {
      descriptions.push(`Created: ${new Date(from).toLocaleDateString()} - ${new Date(to).toLocaleDateString()}`);
    } else if (from) {
      descriptions.push(`Created after: ${new Date(from).toLocaleDateString()}`);
    } else if (to) {
      descriptions.push(`Created before: ${new Date(to).toLocaleDateString()}`);
    }
  }

  if (filters.dueDateRange) {
    const { from, to } = filters.dueDateRange;
    if (from && to) {
      descriptions.push(`Due: ${new Date(from).toLocaleDateString()} - ${new Date(to).toLocaleDateString()}`);
    } else if (from) {
      descriptions.push(`Due after: ${new Date(from).toLocaleDateString()}`);
    } else if (to) {
      descriptions.push(`Due before: ${new Date(to).toLocaleDateString()}`);
    }
  }

  if (filters.isOverdue) {
    descriptions.push('Overdue tasks only');
  }

  return descriptions.join(' • ');
}