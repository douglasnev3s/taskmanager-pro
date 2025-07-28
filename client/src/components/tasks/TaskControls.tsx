"use client"

import { Search, Filter, SortAsc, List, Kanban, CheckSquare2, X, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { TaskPriority } from './TaskCard';
import { useAppSelector } from '@/store/hooks';
import { selectProjectOptions } from '@/store/selectors';

export type ViewMode = 'list' | 'kanban';
export type FilterType = 'all' | 'completed' | 'pending' | 'high' | 'medium' | 'low';
export type SortType = 'created' | 'dueDate' | 'priority' | 'alphabetical';

interface TaskControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  bulkSelectMode: boolean;
  onBulkSelectModeToggle: () => void;
  selectedTasks: Set<string>;
  onBulkDelete?: () => void;
  onBulkComplete?: () => void;
  onBulkPriorityChange?: (priority: TaskPriority) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  totalTasks: number;
  // Project filtering
  projectFilter: string;
  onProjectFilterChange: (projectId: string) => void;
  // Group by project toggle
  groupByProject: boolean;
  onGroupByProjectToggle: () => void;
}

export function TaskControls({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  bulkSelectMode,
  onBulkSelectModeToggle,
  selectedTasks,
  onBulkDelete,
  onBulkComplete,
  onBulkPriorityChange,
  onSelectAll,
  onDeselectAll,
  totalTasks,
  projectFilter,
  onProjectFilterChange,
  groupByProject,
  onGroupByProjectToggle,
}: TaskControlsProps) {
  const projectOptions = useAppSelector(selectProjectOptions);
  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];

  return (
    <div className="space-y-4">
      {/* Main Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 items-center w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Filter */}
          <Select value={filter} onValueChange={(value) => onFilterChange(value as FilterType)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortType)}>
            <SelectTrigger className="w-[140px]">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Project Filter */}
          <Select value={projectFilter} onValueChange={onProjectFilterChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="no-project">No Project</SelectItem>
              {projectOptions.map(project => (
                <SelectItem key={project.value} value={project.value}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    <span>{project.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode & Bulk Select */}
        <div className="flex gap-2 items-center">
          {/* Group by Project Toggle */}
          <Button
            variant={groupByProject ? "default" : "outline"}
            size="sm"
            onClick={onGroupByProjectToggle}
          >
            Group by Project
          </Button>

          {/* Bulk Select Toggle */}
          <Button
            variant={bulkSelectMode ? "default" : "outline"}
            size="sm"
            onClick={onBulkSelectModeToggle}
          >
            <CheckSquare2 className="mr-2 h-4 w-4" />
            Select
          </Button>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="px-3"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              className="px-3"
              onClick={() => onViewModeChange('kanban')}
            >
              <Kanban className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Row */}
      {bulkSelectMode && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSelectAll}
                disabled={selectedTasks.size === totalTasks}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDeselectAll}
                disabled={selectedTasks.size === 0}
              >
                Deselect All
              </Button>
            </div>
            
            {selectedTasks.size > 0 && (
              <Badge variant="secondary">
                {selectedTasks.size} selected
              </Badge>
            )}
          </div>

          {selectedTasks.size > 0 && (
            <div className="flex items-center gap-2">
              {/* Bulk Complete */}
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkComplete}
              >
                <CheckSquare2 className="mr-2 h-4 w-4" />
                Mark Complete
              </Button>

              {/* Bulk Priority Change */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Change Priority
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Set Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onBulkPriorityChange?.('high' as any)}>
                    High Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBulkPriorityChange?.('medium' as any)}>
                    Medium Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBulkPriorityChange?.('low' as any)}>
                    Low Priority
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Bulk Delete */}
              <Button
                variant="destructive"
                size="sm"
                onClick={onBulkDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}

          {/* Exit Bulk Mode */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkSelectModeToggle}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}