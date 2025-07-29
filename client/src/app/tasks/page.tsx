"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  optimisticUpdateTask,
  optimisticDeleteTask
} from '@/store/slices/tasksSlice';
import { 
  TaskForm, 
  TaskList, 
  KanbanBoard, 
  TaskControls,
  ViewMode,
  FilterType,
  SortType
} from '@/components/tasks';
import { Task, TaskStatus, TaskPriority, CreateTaskData, UpdateTaskData } from '@/types';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  
  // Redux state
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  
  // Local state
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Load tasks on component mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  
  // Control states
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('created');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };


  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    // Optimistic update
    dispatch(optimisticDeleteTask(taskToDelete));
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskToDelete);
      return newSet;
    });
    
    try {
      await dispatch(deleteTask(taskToDelete)).unwrap();
      toast.success('Task deleted successfully!');
    } catch (error) {
      // Revert optimistic update
      dispatch(fetchTasks());
      toast.error('Failed to delete task');
    } finally {
      setTaskToDelete(null);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleDuplicateTask = async (task: Task) => {
    const taskData: CreateTaskData = {
      title: `${task.title} (Copy)`,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: task.tags || [],
    };
    
    try {
      await dispatch(createTask(taskData)).unwrap();
      toast.success('Task duplicated successfully!');
    } catch (error) {
      toast.error('Failed to duplicate task');
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;
    
    // Optimistic update
    dispatch(optimisticUpdateTask({ id: taskId, updates: { status: newStatus } }));
    
    try {
      await dispatch(updateTask({ id: taskId, status: newStatus })).unwrap();
      toast.success('Task status updated!');
    } catch (error) {
      // Revert optimistic update
      dispatch(optimisticUpdateTask({ id: taskId, updates: { status: task.status } }));
      toast.error('Failed to update task status');
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Optimistic update
    dispatch(optimisticUpdateTask({ id: taskId, updates: { status: newStatus } }));
    
    try {
      await dispatch(updateTask({ id: taskId, status: newStatus })).unwrap();
      toast.success('Task moved successfully!');
    } catch (error) {
      // Revert optimistic update
      dispatch(optimisticUpdateTask({ id: taskId, updates: { status: task.status } }));
      toast.error('Failed to move task');
    }
  };

  const handleTaskSubmit = async (data: any) => {
    // Convert Date to string for dueDate if it exists
    const taskData = {
      ...data,
      dueDate: data.dueDate instanceof Date ? data.dueDate.toISOString() : data.dueDate,
    };

    try {
      if (editingTask) {
        const updateData: UpdateTaskData = {
          id: editingTask.id,
          ...taskData,
        };
        await dispatch(updateTask(updateData)).unwrap();
        toast.success('Task updated successfully!');
      } else {
        const createData: CreateTaskData = {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority || TaskPriority.MEDIUM,
          dueDate: taskData.dueDate,
          tags: taskData.tags || [],
        };
        await dispatch(createTask(createData)).unwrap();
        toast.success('Task created successfully!');
      }
      setIsTaskFormOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
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
    setSelectedTasks(new Set(tasks.map(task => task.id)));
  };

  const handleDeselectAll = () => {
    setSelectedTasks(new Set());
  };

  const handleBulkDelete = async () => {
    const taskIds = Array.from(selectedTasks);
    const deletionPromises = taskIds.map(taskId => 
      dispatch(deleteTask(taskId)).unwrap()
    );
    
    try {
      await Promise.all(deletionPromises);
      setSelectedTasks(new Set());
      toast.success(`${taskIds.length} tasks deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete some tasks');
      dispatch(fetchTasks()); // Refresh to get accurate state
    }
  };

  const handleBulkComplete = async () => {
    const taskIds = Array.from(selectedTasks);
    const updatePromises = taskIds.map(taskId => 
      dispatch(updateTask({ id: taskId, status: TaskStatus.COMPLETED })).unwrap()
    );
    
    try {
      await Promise.all(updatePromises);
      setSelectedTasks(new Set());
      toast.success(`${taskIds.length} tasks marked as complete!`);
    } catch (error) {
      toast.error('Failed to update some tasks');
      dispatch(fetchTasks()); // Refresh to get accurate state
    }
  };

  const handleBulkPriorityChange = async (priority: TaskPriority) => {
    const taskIds = Array.from(selectedTasks);
    const updatePromises = taskIds.map(taskId => 
      dispatch(updateTask({ id: taskId, priority })).unwrap()
    );
    
    try {
      await Promise.all(updatePromises);
      setSelectedTasks(new Set());
      toast.success(`Priority updated for ${taskIds.length} tasks!`);
    } catch (error) {
      toast.error('Failed to update priority for some tasks');
      dispatch(fetchTasks()); // Refresh to get accurate state
    }
  };

  const handleBulkSelectModeToggle = () => {
    setBulkSelectMode(!bulkSelectMode);
    if (bulkSelectMode) {
      setSelectedTasks(new Set());
    }
  };


  // Use all tasks (no project filtering)
  const filteredTasks = tasks;

  // Show loading state
  if (loading && tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
            <p className="text-muted-foreground">Loading your tasks...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
            <p className="text-muted-foreground">Failed to load tasks</p>
          </div>
          <Button onClick={() => dispatch(fetchTasks())}>
            Retry
          </Button>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => dispatch(fetchTasks())}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
          <p className="text-muted-foreground">
            Manage and organize all your tasks in one place.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Controls */}
      <TaskControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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


      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}