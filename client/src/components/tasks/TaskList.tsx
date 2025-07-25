"use client"

import { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Task } from './TaskCard';
import { TaskCard } from './TaskCard';
import { TaskEmptyState } from './TaskEmptyState';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onDuplicate?: (task: Task) => void;
  searchQuery?: string;
  filter?: 'all' | 'completed' | 'pending' | 'high' | 'medium' | 'low';
  sortBy?: 'created' | 'dueDate' | 'priority' | 'alphabetical';
  onCreateTask?: () => void;
  selectedTasks?: Set<string>;
  onTaskSelect?: (taskId: string, selected: boolean) => void;
  bulkSelectMode?: boolean;
}

interface TaskItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    tasks: Task[];
    onToggleComplete?: (taskId: string) => void;
    onEdit?: (task: Task) => void;
    onDelete?: (taskId: string) => void;
    onDuplicate?: (task: Task) => void;
    selectedTasks?: Set<string>;
    onTaskSelect?: (taskId: string, selected: boolean) => void;
    bulkSelectMode?: boolean;
  };
}

const TaskItem = ({ index, style, data }: TaskItemProps) => {
  const task = data.tasks[index];
  
  if (!task) return null;

  return (
    <div style={style} className="px-1 py-2">
      <div className="relative">
        {data.bulkSelectMode && (
          <div className="absolute -left-8 top-4 z-10">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={data.selectedTasks?.has(task.id) || false}
              onChange={(e) => data.onTaskSelect?.(task.id, e.target.checked)}
            />
          </div>
        )}
        <TaskCard
          task={task}
          onToggleComplete={data.onToggleComplete}
          onEdit={data.onEdit}
          onDelete={data.onDelete}
          onDuplicate={data.onDuplicate}
        />
      </div>
    </div>
  );
};

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
  searchQuery = '',
  filter = 'all',
  sortBy = 'created',
  onCreateTask,
  selectedTasks = new Set(),
  onTaskSelect,
  bulkSelectMode = false,
}: TaskListProps) {
  // Filter tasks based on search query and filter
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply status/priority filter
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed');
        break;
      case 'pending':
        filtered = filtered.filter(task => task.status !== 'completed');
        break;
      case 'high':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      case 'medium':
        filtered = filtered.filter(task => task.priority === 'medium');
        break;
      case 'low':
        filtered = filtered.filter(task => task.priority === 'low');
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    return filtered;
  }, [tasks, searchQuery, filter]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks];

    switch (sortBy) {
      case 'dueDate':
        sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'created':
      default:
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return sorted;
  }, [filteredTasks, sortBy]);

  if (sortedTasks.length === 0) {
    return (
      <TaskEmptyState
        onCreateTask={onCreateTask}
        title={searchQuery || filter !== 'all' ? "No tasks match your criteria" : "No tasks yet"}
        description={
          searchQuery || filter !== 'all'
            ? "Try adjusting your search terms or filters."
            : "Get started by creating your first task to stay organized and productive."
        }
        showCreateButton={!searchQuery && filter === 'all'}
      />
    );
  }

  const itemData = {
    tasks: sortedTasks,
    onToggleComplete,
    onEdit,
    onDelete,
    onDuplicate,
    selectedTasks,
    onTaskSelect,
    bulkSelectMode,
  };

  // Calculate item height based on bulk select mode
  const itemHeight = bulkSelectMode ? 160 : 140;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
          {searchQuery && ` matching "${searchQuery}"`}
          {filter !== 'all' && ` (${filter})`}
        </p>
        {bulkSelectMode && selectedTasks.size > 0 && (
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {selectedTasks.size} selected
          </p>
        )}
      </div>

      <div className={bulkSelectMode ? 'pl-10' : ''}>
        <List
          height={Math.min(600, sortedTasks.length * itemHeight)}
          width="100%"
          itemCount={sortedTasks.length}
          itemSize={itemHeight}
          itemData={itemData}
          className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
        >
          {TaskItem}
        </List>
      </div>
    </div>
  );
}