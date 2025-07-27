"use client"

import React from 'react';
import { X, Calendar, Tag, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdvancedSearchFilters, TaskStatus, TaskPriority } from '@/types';
import { format } from 'date-fns';

interface FilterPillsProps {
  filters: AdvancedSearchFilters;
  onRemoveFilter: (filterType: keyof AdvancedSearchFilters, value?: any) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterPills({ filters, onRemoveFilter, onClearAll, className }: FilterPillsProps) {
  const activeFilters: Array<{
    key: keyof AdvancedSearchFilters;
    label: string;
    value?: any;
    icon?: React.ReactNode;
  }> = [];

  // Text search
  if (filters.text) {
    activeFilters.push({
      key: 'text',
      label: `Search: "${filters.text}"`,
      icon: <Filter className="h-3 w-3" />,
    });
  }

  // Status filters
  if (filters.status?.length) {
    filters.status.forEach(status => {
      activeFilters.push({
        key: 'status',
        label: `Status: ${status.replace('-', ' ')}`,
        value: status,
        icon: <Filter className="h-3 w-3" />,
      });
    });
  }

  // Priority filters
  if (filters.priority?.length) {
    filters.priority.forEach(priority => {
      activeFilters.push({
        key: 'priority',
        label: `Priority: ${priority}`,
        value: priority,
        icon: <Filter className="h-3 w-3" />,
      });
    });
  }

  // Tag filters
  if (filters.tags?.length) {
    filters.tags.forEach(tag => {
      activeFilters.push({
        key: 'tags',
        label: `Tag: ${tag}`,
        value: tag,
        icon: <Tag className="h-3 w-3" />,
      });
    });
  }

  // Created date range
  if (filters.createdDateRange) {
    const { from, to } = filters.createdDateRange;
    let label = 'Created: ';
    if (from && to) {
      label += `${format(from, 'MMM dd')} - ${format(to, 'MMM dd')}`;
    } else if (from) {
      label += `from ${format(from, 'MMM dd, yyyy')}`;
    } else if (to) {
      label += `until ${format(to, 'MMM dd, yyyy')}`;
    }
    
    activeFilters.push({
      key: 'createdDateRange',
      label,
      icon: <Calendar className="h-3 w-3" />,
    });
  }

  // Due date range
  if (filters.dueDateRange) {
    const { from, to } = filters.dueDateRange;
    let label = 'Due: ';
    if (from && to) {
      label += `${format(from, 'MMM dd')} - ${format(to, 'MMM dd')}`;
    } else if (from) {
      label += `from ${format(from, 'MMM dd, yyyy')}`;
    } else if (to) {
      label += `until ${format(to, 'MMM dd, yyyy')}`;
    }
    
    activeFilters.push({
      key: 'dueDateRange',
      label,
      icon: <Calendar className="h-3 w-3" />,
    });
  }

  // Overdue filter
  if (filters.isOverdue) {
    activeFilters.push({
      key: 'isOverdue',
      label: 'Overdue tasks',
      icon: <Clock className="h-3 w-3" />,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemoveFilter = (filterKey: keyof AdvancedSearchFilters, value?: any) => {
    if (filterKey === 'status' && value) {
      // Remove specific status from array
      const currentStatuses = filters.status || [];
      const updated = currentStatuses.filter(s => s !== value);
      onRemoveFilter('status', updated.length > 0 ? updated : undefined);
    } else if (filterKey === 'priority' && value) {
      // Remove specific priority from array
      const currentPriorities = filters.priority || [];
      const updated = currentPriorities.filter(p => p !== value);
      onRemoveFilter('priority', updated.length > 0 ? updated : undefined);
    } else if (filterKey === 'tags' && value) {
      // Remove specific tag from array
      const currentTags = filters.tags || [];
      const updated = currentTags.filter(t => t !== value);
      onRemoveFilter('tags', updated.length > 0 ? updated : undefined);
    } else {
      // Remove entire filter
      onRemoveFilter(filterKey, undefined);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground font-medium">Active filters:</span>
      
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${filter.value || index}`}
          variant="secondary"
          className="flex items-center gap-1 pr-1 pl-2 py-1"
        >
          {filter.icon}
          <span className="text-xs">{filter.label}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground ml-1"
            onClick={() => handleRemoveFilter(filter.key, filter.value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {activeFilters.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="h-7 px-2 text-xs"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}