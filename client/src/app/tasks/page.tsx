"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TaskCard, TaskForm, TaskEmptyState, Task } from '@/components/tasks';
import toast from 'react-hot-toast';

// Mock data for testing
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature implementation including API endpoints and user guides.',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date('2025-07-28'),
    tags: ['documentation', 'urgent'],
    createdAt: new Date('2025-07-20'),
    updatedAt: new Date('2025-07-25'),
  },
  {
    id: '2',
    title: 'Review code changes',
    description: 'Review pull requests from team members and provide feedback.',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date('2025-07-26'),
    tags: ['review', 'code'],
    createdAt: new Date('2025-07-22'),
    updatedAt: new Date('2025-07-23'),
  },
  {
    id: '3',
    title: 'Update API endpoints',
    description: 'Implement new authentication system for better security.',
    priority: 'high',
    status: 'completed',
    dueDate: new Date('2025-07-20'),
    tags: ['api', 'security', 'backend'],
    createdAt: new Date('2025-07-15'),
    updatedAt: new Date('2025-07-20'),
  },
  {
    id: '4',
    title: 'Design system improvements',
    description: 'Update color palette and component library.',
    priority: 'low',
    status: 'todo',
    tags: ['design', 'ui/ux'],
    createdAt: new Date('2025-07-18'),
    updatedAt: new Date('2025-07-18'),
  },
  {
    id: '5',
    title: 'Database optimization',
    description: 'Optimize database queries for better performance and add indexes.',
    priority: 'medium',
    status: 'in-progress',
    dueDate: new Date('2025-07-30'),
    tags: ['database', 'performance'],
    createdAt: new Date('2025-07-21'),
    updatedAt: new Date('2025-07-24'),
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  const handleTaskSubmit = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      // Update existing task
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
      // Create new task
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

  return (
    <div className="space-y-6">
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

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <TaskEmptyState 
            onCreateTask={handleCreateTask}
            title={searchQuery ? "No tasks found" : "No tasks yet"}
            description={searchQuery ? "Try adjusting your search terms." : "Get started by creating your first task to stay organized and productive."}
          />
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onDuplicate={handleDuplicateTask}
              />
            ))}
          </div>
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