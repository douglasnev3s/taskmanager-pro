"use client"

import { useMemo } from 'react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppSelector } from '@/store/hooks';
import { selectProjectById } from '@/store/selectors';
import { FolderOpen, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TasksByProjectProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
  bulkSelectMode: boolean;
  selectedTasks: Set<string>;
  onTaskSelect: (taskId: string) => void;
}

interface ProjectGroupHeaderProps {
  projectId: string | null;
  tasks: Task[];
}

function ProjectGroupHeader({ projectId, tasks }: ProjectGroupHeaderProps) {
  const project = useAppSelector(state => 
    projectId ? selectProjectById(projectId)(state) : null
  );
  
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const overdue = tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < new Date() && 
      task.status !== 'completed'
    ).length;
    
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, inProgress, overdue, progress };
  }, [tasks]);

  if (!projectId || !project) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FolderOpen className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-lg">No Project</CardTitle>
                <CardDescription>Unassigned tasks</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">{stats.total} tasks</Badge>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>{stats.completed} completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>{stats.inProgress} in progress</span>
              </div>
              {stats.overdue > 0 && (
                <div className="flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span>{stats.overdue} overdue</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{stats.progress}%</span>
              <Progress value={stats.progress} className="w-24 h-2" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: project.color }}
            />
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {project.category}
            </Badge>
            <Badge variant="secondary">{stats.total} tasks</Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>{stats.completed} completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>{stats.inProgress} in progress</span>
            </div>
            {stats.overdue > 0 && (
              <div className="flex items-center space-x-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span>{stats.overdue} overdue</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{stats.progress}%</span>
            <Progress value={stats.progress} className="w-24 h-2" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function TasksByProject({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  bulkSelectMode,
  selectedTasks,
  onTaskSelect,
}: TasksByProjectProps) {
  const tasksByProject = useMemo(() => {
    const grouped = new Map<string | null, Task[]>();
    
    tasks.forEach(task => {
      const projectId = task.projectId || null;
      if (!grouped.has(projectId)) {
        grouped.set(projectId, []);
      }
      grouped.get(projectId)!.push(task);
    });
    
    // Sort projects: projects with IDs first, then no-project
    const sortedEntries = Array.from(grouped.entries()).sort(([a], [b]) => {
      if (a === null && b !== null) return 1;
      if (a !== null && b === null) return -1;
      return 0;
    });
    
    return sortedEntries;
  }, [tasks]);

  if (tasksByProject.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">No tasks found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or create a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasksByProject.map(([projectId, projectTasks]) => (
        <div key={projectId || 'no-project'}>
          <ProjectGroupHeader projectId={projectId} tasks={projectTasks} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={() => onTaskUpdate(task)}
                onDelete={() => onTaskDelete(task.id)}
                onEdit={() => onTaskEdit(task)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}