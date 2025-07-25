"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { 
  TaskForm, 
  TaskList, 
  KanbanBoard, 
  TaskControls,
  Task,
  TaskStatus,
  TaskPriority,
  ViewMode,
  FilterType,
  SortType
} from '@/components/tasks';
import toast from 'react-hot-toast';

// Extended mock data for testing
const generateMockTasks = (): Task[] => {
  
  const baseTasks = [
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the new feature implementation including API endpoints and user guides.',
      priority: 'high' as TaskPriority,
      status: 'in-progress' as TaskStatus,
      dueDate: new Date('2025-07-28'),
      tags: ['documentation', 'urgent'],
    },
    {
      title: 'Review code changes',
      description: 'Review pull requests from team members and provide feedback on code quality and architecture.',
      priority: 'medium' as TaskPriority,
      status: 'todo' as TaskStatus,
      dueDate: new Date('2025-07-26'),
      tags: ['review', 'code'],
    },
    {
      title: 'Update API endpoints',
      description: 'Implement new authentication system for better security and user management.',
      priority: 'high' as TaskPriority,
      status: 'completed' as TaskStatus,
      dueDate: new Date('2025-07-20'),
      tags: ['api', 'security', 'backend'],
    },
    {
      title: 'Design system improvements',
      description: 'Update color palette and component library for better consistency.',
      priority: 'low' as TaskPriority,
      status: 'todo' as TaskStatus,
      tags: ['design', 'ui/ux'],
    },
    {
      title: 'Database optimization',
      description: 'Optimize database queries for better performance and add necessary indexes.',
      priority: 'medium' as TaskPriority,
      status: 'in-progress' as TaskStatus,
      dueDate: new Date('2025-07-30'),
      tags: ['database', 'performance', 'backend'],
    },
    {
      title: 'Mobile responsiveness fixes',
      description: 'Fix layout issues on mobile devices and improve touch interactions.',
      priority: 'medium' as TaskPriority,
      status: 'todo' as TaskStatus,
      dueDate: new Date('2025-08-02'),
      tags: ['frontend', 'mobile', 'bug'],
    },
    {
      title: 'User testing session',
      description: 'Conduct user testing sessions with stakeholders and collect feedback.',
      priority: 'high' as TaskPriority,
      status: 'completed' as TaskStatus,
      dueDate: new Date('2025-07-18'),
      tags: ['testing', 'user-research'],
    },
    {
      title: 'Performance monitoring setup',
      description: 'Set up performance monitoring tools and alerting systems.',
      priority: 'low' as TaskPriority,
      status: 'todo' as TaskStatus,
      tags: ['monitoring', 'infrastructure'],
    },
    {
      title: 'Security audit',
      description: 'Perform comprehensive security audit of the application.',
      priority: 'high' as TaskPriority,
      status: 'in-progress' as TaskStatus,
      dueDate: new Date('2025-07-29'),
      tags: ['security', 'audit'],
    },
    {
      title: 'Accessibility improvements',
      description: 'Implement WCAG 2.1 AA compliance across the application.',
      priority: 'medium' as TaskPriority,
      status: 'todo' as TaskStatus,
      tags: ['accessibility', 'frontend'],
    },
  ];

  return baseTasks.map((task, index) => ({
    id: (index + 1).toString(),
    ...task,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
    updatedAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000), // Random date within last 2 days
  }));
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(generateMockTasks());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  
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
    setTasks(tasks.filter(task => task.id !== taskId));
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
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
    toast.success('Task duplicated successfully!');
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'todo' : 'completed',
            updatedAt: new Date()
          }
        : task
    ));
    toast.success('Task status updated!');
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            updatedAt: new Date()
          }
        : task
    ));
    toast.success('Task moved successfully!');
  };

  const handleTaskSubmit = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { 
              ...task, 
              ...data,
              updatedAt: new Date()
            }
          : task
      ));
      toast.success('Task updated successfully!');
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTasks(prev => [newTask, ...prev]);
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
    setSelectedTasks(new Set(tasks.map(task => task.id)));
  };

  const handleDeselectAll = () => {
    setSelectedTasks(new Set());
  };

  const handleBulkDelete = () => {
    setTasks(tasks.filter(task => !selectedTasks.has(task.id)));
    setSelectedTasks(new Set());
    toast.success(`${selectedTasks.size} tasks deleted successfully!`);
  };

  const handleBulkComplete = () => {
    setTasks(tasks.map(task => 
      selectedTasks.has(task.id)
        ? { ...task, status: 'completed' as TaskStatus, updatedAt: new Date() }
        : task
    ));
    setSelectedTasks(new Set());
    toast.success(`${selectedTasks.size} tasks marked as complete!`);
  };

  const handleBulkPriorityChange = (priority: TaskPriority) => {
    setTasks(tasks.map(task => 
      selectedTasks.has(task.id)
        ? { ...task, priority, updatedAt: new Date() }
        : task
    ));
    setSelectedTasks(new Set());
    toast.success(`Priority updated for ${selectedTasks.size} tasks!`);
  };

  const handleBulkSelectModeToggle = () => {
    setBulkSelectMode(!bulkSelectMode);
    if (bulkSelectMode) {
      setSelectedTasks(new Set());
    }
  };

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
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
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
        totalTasks={tasks.length}
      />

      {/* Task Views */}
      <div className="space-y-4">
        {viewMode === 'list' ? (
          <TaskList
            tasks={tasks}
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
            tasks={tasks}
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
    </div>
  );
}