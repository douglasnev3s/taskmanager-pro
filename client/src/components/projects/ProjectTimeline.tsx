"use client"

import { useState, useMemo } from 'react';
import { Project, Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface ProjectTimelineProps {
  projects: Project[];
  tasks: Task[];
  className?: string;
}

type TimelineView = 'week' | 'month' | 'quarter' | 'year';

interface TimelineItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  type: 'project' | 'task';
  priority?: string;
  status?: string;
  color?: string;
  projectId?: string;
}

export function ProjectTimeline({ projects, tasks, className }: ProjectTimelineProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<TimelineView>('month');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  
  // Generate timeline items from projects and tasks
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];
    
    // Add projects to timeline
    projects
      .filter(project => selectedProject === 'all' || project.id === selectedProject)
      .forEach(project => {
        if (project.startDate && project.deadline) {
          items.push({
            id: project.id,
            title: project.name,
            startDate: new Date(project.startDate),
            endDate: new Date(project.deadline),
            progress: project.progress,
            type: 'project',
            priority: project.priority,
            status: project.status,
            color: project.color,
          });
        }
      });
    
    // Add tasks to timeline (only if showing specific project or all)
    tasks
      .filter(task => {
        if (!task.dueDate) return false;
        if (selectedProject === 'all') return true;
        return task.projectId === selectedProject;
      })
      .forEach(task => {
        const startDate = task.createdAt ? new Date(task.createdAt) : new Date();
        const endDate = new Date(task.dueDate!);
        
        items.push({
          id: task.id,
          title: task.title,
          startDate,
          endDate,
          progress: task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : 0,
          type: 'task',
          priority: task.priority,
          status: task.status,
          projectId: task.projectId,
        });
      });
    
    return items.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [projects, tasks, selectedProject]);

  // Calculate timeline range based on view
  const getTimelineRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    switch (view) {
      case 'week':
        start.setDate(start.getDate() - start.getDay());
        end.setDate(start.getDate() + 6);
        break;
      case 'month':
        start.setDate(1);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        break;
      case 'quarter':
        const quarter = Math.floor(start.getMonth() / 3);
        start.setMonth(quarter * 3, 1);
        end.setMonth(quarter * 3 + 3, 0);
        break;
      case 'year':
        start.setMonth(0, 1);
        end.setMonth(11, 31);
        break;
    }
    
    return { start, end };
  };

  const { start: rangeStart, end: rangeEnd } = getTimelineRange();
  
  // Generate time grid
  const generateTimeGrid = () => {
    const days = [];
    const current = new Date(rangeStart);
    
    while (current <= rangeEnd) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const timeGrid = generateTimeGrid();
  const totalDays = timeGrid.length;
  
  // Calculate item position and width
  const getItemStyle = (item: TimelineItem) => {
    const itemStart = Math.max(item.startDate.getTime(), rangeStart.getTime());
    const itemEnd = Math.min(item.endDate.getTime(), rangeEnd.getTime());
    
    const startOffset = (itemStart - rangeStart.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (itemEnd - itemStart) / (1000 * 60 * 60 * 24);
    
    const left = (startOffset / totalDays) * 100;
    const width = Math.max((duration / totalDays) * 100, 0.5); // Minimum 0.5% width
    
    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'quarter':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 3 : -3));
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getDateLabel = () => {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (view) {
      case 'week':
        return `Week of ${rangeStart.toLocaleDateString()}`;
      case 'month':
        options.month = 'long';
        options.year = 'numeric';
        break;
      case 'quarter':
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        return `Q${quarter} ${currentDate.getFullYear()}`;
      case 'year':
        options.year = 'numeric';
        break;
    }
    
    return currentDate.toLocaleDateString('en-US', options);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': 
      case 'in-progress': return 'bg-blue-500';
      case 'on-hold': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Timeline
            </CardTitle>
            <CardDescription>
              Gantt-style visualization of projects and tasks
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* View Selector */}
            <Select value={view} onValueChange={(value: TimelineView) => setView(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>

            {/* Project Filter */}
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">{getDateLabel()}</h3>
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Timeline Grid */}
        <div className="relative overflow-x-auto">
          {/* Time Grid Header */}
          <div className="flex border-b pb-2 mb-4 min-w-[800px]">
            {timeGrid.map((date, index) => {
              const showLabel = view === 'week' || 
                                date.getDate() === 1 || 
                                (view === 'month' && date.getDate() % 5 === 1);
              
              return (
                <div 
                  key={index} 
                  className="flex-1 text-xs text-center text-muted-foreground border-l first:border-l-0"
                  style={{ minWidth: '20px' }}
                >
                  {showLabel && (
                    <div>
                      {view === 'week' ? date.toLocaleDateString('en-US', { weekday: 'short' }) :
                       view === 'month' ? date.getDate() :
                       view === 'quarter' ? date.toLocaleDateString('en-US', { month: 'short' }) :
                       date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline Items */}
          <div className="space-y-2 min-w-[800px]" style={{ minHeight: '200px' }}>
            {timelineItems.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No timeline items in selected range</p>
                </div>
              </div>
            ) : (
              timelineItems.map((item, index) => {
                const style = getItemStyle(item);
                const bgColor = item.type === 'project' && item.color ? 
                  `rgb(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)})` :
                  '';
                
                return (
                  <div key={item.id} className="relative h-8 bg-gray-50 rounded">
                    {/* Timeline Bar */}
                    <div
                      className={`absolute top-1 h-6 rounded flex items-center px-2 text-xs text-white font-medium ${
                        item.type === 'project' ? 'opacity-90' : 'opacity-80'
                      } ${item.type === 'project' ? '' : getPriorityColor(item.priority)}`}
                      style={{
                        ...style,
                        backgroundColor: bgColor || undefined,
                        minWidth: '60px'
                      }}
                    >
                      <div className="truncate flex-1">
                        {item.title}
                      </div>
                      
                      {/* Progress indicator */}
                      {item.progress > 0 && (
                        <div className="ml-2 text-xs">
                          {item.progress}%
                        </div>
                      )}
                    </div>
                    
                    {/* Item label on the left */}
                    <div className="absolute left-0 top-0 h-8 flex items-center px-2 bg-white border-r w-48 truncate">
                      <Badge variant="outline" className="mr-2 text-xs">
                        {item.type}
                      </Badge>
                      <span className="text-sm font-medium truncate">
                        {item.title}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-4 border-t text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Low Priority</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}