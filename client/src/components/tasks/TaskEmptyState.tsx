"use client"

import { Plus, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TaskEmptyStateProps {
  onCreateTask?: () => void;
  title?: string;
  description?: string;
  showCreateButton?: boolean;
}

export function TaskEmptyState({ 
  onCreateTask,
  title = "No tasks yet",
  description = "Get started by creating your first task to stay organized and productive.",
  showCreateButton = true
}: TaskEmptyStateProps) {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CheckSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
        
        {showCreateButton && onCreateTask && (
          <Button onClick={onCreateTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Task
          </Button>
        )}
      </CardContent>
    </Card>
  );
}