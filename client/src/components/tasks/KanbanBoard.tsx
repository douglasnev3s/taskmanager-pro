"use client"

import { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { TaskEmptyState } from './TaskEmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanBoardProps {
  tasks: Task[];
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onDuplicate?: (task: Task) => void;
  onCreateTask?: () => void;
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  searchQuery?: string;
  filter?: 'all' | 'completed' | 'pending' | 'high' | 'medium' | 'low';
  highlightMatches?: boolean;
}

interface KanbanColumn {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}

export function KanbanBoard({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateTask,
  onTaskStatusChange,
  searchQuery = '',
  filter = 'all',
  highlightMatches = false,
}: KanbanBoardProps) {
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

  // Group tasks by status
  const columns: KanbanColumn[] = useMemo(() => {
    const todoTasks = filteredTasks.filter(task => task.status === TaskStatus.TODO);
    const inProgressTasks = filteredTasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
    const completedTasks = filteredTasks.filter(task => task.status === TaskStatus.COMPLETED);

    return [
      {
        id: TaskStatus.TODO,
        title: 'To Do',
        color: 'bg-gray-100 dark:bg-gray-800',
        tasks: todoTasks,
      },
      {
        id: TaskStatus.IN_PROGRESS,
        title: 'In Progress',
        color: 'bg-blue-100 dark:bg-blue-900/20',
        tasks: inProgressTasks,
      },
      {
        id: TaskStatus.COMPLETED,
        title: 'Done',
        color: 'bg-green-100 dark:bg-green-900/20',
        tasks: completedTasks,
      },
    ];
  }, [filteredTasks]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination, return early
    if (!destination) return;

    // If dropped in the same position, return early
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update task status if moved to different column
    if (destination.droppableId !== source.droppableId) {
      const newStatus = destination.droppableId as TaskStatus;
      onTaskStatusChange?.(draggableId, newStatus);
    }
  };

  if (filteredTasks.length === 0) {
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map((column) => (
          <Card key={column.id} className="flex flex-col h-fit max-h-[800px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {column.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {column.tasks.length}
                  </Badge>
                  {column.id === 'todo' && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={onCreateTask}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <CardContent
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 space-y-3 p-4 transition-colors min-h-[200px] overflow-y-auto ${
                    snapshot.isDraggingOver ? column.color : ''
                  }`}
                >
                  {column.tasks.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                      {column.id === 'todo' ? 'No tasks to do' : 
                       column.id === 'in-progress' ? 'No tasks in progress' : 
                       'No completed tasks'}
                    </div>
                  ) : (
                    column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-transform ${
                              snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                            }`}
                          >
                            <TaskCard
                              task={task}
                              onToggleComplete={onToggleComplete}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onDuplicate={onDuplicate}
                              searchQuery={searchQuery}
                              highlightMatches={highlightMatches}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
}