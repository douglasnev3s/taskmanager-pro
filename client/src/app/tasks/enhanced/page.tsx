"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { 
  TaskForm, 
  TaskList, 
  KanbanBoard, 
  EnhancedTaskControls,
  ViewMode,
  FilterType,
  SortType
} from '@/components/tasks';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
  selectFilteredTasks,
  selectSearchQuery,
  selectAdvancedSearchFilters,
  selectAvailableTags,
  selectTasksStatistics,
} from '@/store/selectors/tasksSelectors';
import { 
  addTaskLocal,
  updateTaskLocal,
  removeTaskLocal,
  toggleTaskComplete,
  optimisticUpdateTask,
} from '@/store/slices/tasksSlice';
import toast from 'react-hot-toast';

// Import performance testing for demonstration
import { quickPerformanceTest, PerformanceTestSuite } from '@/lib/performance-testing';

export default function EnhancedTasksPage() {
  const dispatch = useAppDispatch();
  
  // Redux state
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const searchQuery = useAppSelector(selectSearchQuery);
  const advancedFilters = useAppSelector(selectAdvancedSearchFilters);
  const availableTags = useAppSelector(selectAvailableTags);
  const statistics = useAppSelector(selectTasksStatistics);

  // Local state
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  
  // Control states
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('created');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Run performance test on component mount
  useEffect(() => {
    // Run a quick performance test in development
    if (process.env.NODE_ENV === 'development') {
      console.log('=== Advanced Search Performance Test ===');
      quickPerformanceTest();
      
      // Optionally run full test suite (commented out to avoid spamming console)
      // const testSuite = new PerformanceTestSuite();
      // testSuite.runStandardTests();
      // testSuite.printResults();
    }
  }, []);

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(removeTaskLocal(taskId));
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
    toast.success('Task deleted successfully!');
  };

  const handleDuplicateTask = (task: Task) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      title: `${task.title} (Copy)`,
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addTaskLocal(newTask));
    toast.success('Task duplicated successfully!');
  };

  const handleToggleComplete = (taskId: string) => {
    dispatch(toggleTaskComplete(taskId));
    toast.success('Task status updated!');
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    dispatch(optimisticUpdateTask({
      id: taskId,
      updates: {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }
    }));
    toast.success('Task moved successfully!');
  };

  const handleTaskSubmit = (data: any) => {
    // Convert Date to string for dueDate if it exists
    const taskData = {
      ...data,
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
    };

    if (editingTask) {
      dispatch(updateTaskLocal({
        ...editingTask,
        ...taskData,
        updatedAt: new Date().toISOString(),
      }));
      toast.success('Task updated successfully!');
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addTaskLocal(newTask));
      toast.success('Task created successfully!');
    }
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleTaskSelect = (taskId: string, selected: boolean) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedTasks(new Set(filteredTasks.map(task => task.id)));
  };

  const handleDeselectAll = () => {
    setSelectedTasks(new Set());
  };

  const handleBulkDelete = () => {
    selectedTasks.forEach(taskId => {
      dispatch(removeTaskLocal(taskId));
    });
    setSelectedTasks(new Set());
    toast.success(`${selectedTasks.size} tasks deleted successfully!`);
  };

  const handleBulkComplete = () => {
    selectedTasks.forEach(taskId => {
      dispatch(optimisticUpdateTask({
        id: taskId,
        updates: {
          status: TaskStatus.COMPLETED,
          updatedAt: new Date().toISOString(),
        }
      }));
    });
    setSelectedTasks(new Set());
    toast.success(`${selectedTasks.size} tasks marked as complete!`);
  };

  const handleBulkPriorityChange = (priority: TaskPriority) => {
    selectedTasks.forEach(taskId => {
      dispatch(optimisticUpdateTask({
        id: taskId,
        updates: {
          priority,
          updatedAt: new Date().toISOString(),
        }
      }));
    });
    setSelectedTasks(new Set());
    toast.success(`Priority updated for ${selectedTasks.size} tasks!`);
  };

  const handleBulkSelectModeToggle = () => {
    setBulkSelectMode(!bulkSelectMode);
    if (bulkSelectMode) {
      setSelectedTasks(new Set());
    }
  };

  const hasActiveAdvancedFilters = Object.keys(advancedFilters).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Tasks</h1>
          <p className="text-muted-foreground">
            Advanced search and filtering with performance optimization.
          </p>
          
          {/* Statistics */}
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Total: {statistics.total}</span>
            <span>Completed: {statistics.completed}</span>
            <span>In Progress: {statistics.inProgress}</span>
            <span>Overdue: {statistics.overdue}</span>
            {hasActiveAdvancedFilters && (
              <span className="font-medium text-foreground">
                Filtered: {filteredTasks.length} tasks
              </span>
            )}
          </div>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Enhanced Controls */}
      <EnhancedTaskControls
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        bulkSelectMode={bulkSelectMode}
        onBulkSelectModeToggle={handleBulkSelectModeToggle}
        selectedTasks={selectedTasks}
        onBulkDelete={handleBulkDelete}
        onBulkComplete={handleBulkComplete}
        onBulkPriorityChange={handleBulkPriorityChange}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        totalTasks={filteredTasks.length}
      />

      {/* Task Views */}
      <div className="space-y-4">
        {viewMode === 'list' ? (
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDuplicate={handleDuplicateTask}
            onCreateTask={handleCreateTask}
            searchQuery={searchQuery}
            filter={filter}
            sortBy={sortBy}
            selectedTasks={selectedTasks}
            onTaskSelect={handleTaskSelect}
            bulkSelectMode={bulkSelectMode}
            highlightMatches={true}
          />
        ) : (
          <KanbanBoard
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDuplicate={handleDuplicateTask}
            onCreateTask={handleCreateTask}
            onTaskStatusChange={handleTaskStatusChange}
            searchQuery={searchQuery}
            filter={filter}
            highlightMatches={true}
          />
        )}
      </div>

      {/* Task Form Dialog */}
      <TaskForm
        task={editingTask}
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={handleTaskSubmit}
      />

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
          <h3 className="font-semibold mb-2">Development Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Available Tags:</strong> {availableTags.join(', ')}
            </div>
            <div>
              <strong>Active Filters:</strong> {Object.keys(advancedFilters).length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}