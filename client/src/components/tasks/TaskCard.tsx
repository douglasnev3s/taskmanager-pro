"use client"

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Copy, 
  Check 
} from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onDuplicate?: (task: Task) => void;
}

const priorityConfig = {
  high: {
    label: 'High Priority',
    className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  },
  medium: {
    label: 'Medium Priority',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  },
  low: {
    label: 'Low Priority',
    className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  },
};

const statusConfig = {
  todo: {
    label: 'To Do',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  },
};

export function TaskCard({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: TaskCardProps) {
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed');
  
  const handleToggleComplete = () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    onToggleComplete?.(task.id);
  };

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleDelete = () => {
    onDelete?.(task.id);
  };

  const handleDuplicate = () => {
    onDuplicate?.(task);
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'completed';

  return (
    <Card className={cn(
      "relative transition-all duration-200 hover:shadow-md",
      isCompleted && "opacity-75",
      isOverdue && "border-red-200 dark:border-red-800"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              <Checkbox
                checked={isCompleted}
                onCheckedChange={handleToggleComplete}
                className="h-5 w-5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-sm leading-5 mb-1",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className={cn(
                  "text-sm text-muted-foreground line-clamp-2",
                  isCompleted && "line-through"
                )}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open task menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleComplete}>
                <Check className="mr-2 h-4 w-4" />
                {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Badge */}
            <Badge 
              variant="outline" 
              className={cn("text-xs", priorityConfig[task.priority].className)}
            >
              {priorityConfig[task.priority].label}
            </Badge>

            {/* Status Badge */}
            <Badge 
              variant="outline"
              className={cn("text-xs", statusConfig[task.status].className)}
            >
              {statusConfig[task.status].label}
            </Badge>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <>
                {task.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue 
                ? "text-red-600 dark:text-red-400" 
                : "text-muted-foreground"
            )}>
              {isOverdue ? (
                <Clock className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              <span>
                {isOverdue ? 'Overdue: ' : 'Due: '}
                {format(task.dueDate, 'MMM d, yyyy')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}