"use client"

import { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Calendar
} from 'lucide-react';

interface ProjectHealthCardProps {
  project: Project;
  className?: string;
}

export function ProjectHealthCard({ project, className }: ProjectHealthCardProps) {
  const { progressMetrics } = project;
  
  if (!progressMetrics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Project Health
          </CardTitle>
          <CardDescription>No progress data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This project needs tasks to display health metrics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { health } = progressMetrics;
  
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'ahead': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'behind': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'on-time': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getHealthIcon = () => {
    if (health.isOnTrack) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {getHealthIcon()}
          Project Health
        </CardTitle>
        <CardDescription>
          {health.isOnTrack ? 'Project is on track' : 'Project needs attention'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Level */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Risk Level</span>
          <Badge className={getRiskLevelColor(health.riskLevel)}>
            {health.riskLevel.toUpperCase()}
          </Badge>
        </div>

        {/* Completion Trend */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Completion Trend</span>
          <div className="flex items-center gap-1">
            {getTrendIcon(health.completionTrend)}
            <span className="text-sm capitalize">{health.completionTrend}</span>
          </div>
        </div>

        {/* Progress Statistics */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <p className="font-medium">{progressMetrics.completedTasks}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-600" />
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <p className="font-medium">{progressMetrics.inProgressTasks}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <span className="text-muted-foreground">Overdue</span>
            </div>
            <p className="font-medium">{progressMetrics.overdueTasks}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-gray-600" />
              <span className="text-muted-foreground">Velocity</span>
            </div>
            <p className="font-medium">{progressMetrics.velocity.toFixed(1)}/week</p>
          </div>
        </div>

        {/* Estimated Completion */}
        {progressMetrics.estimatedCompletion && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Est. Completion</span>
            <span className="font-medium">
              {new Date(progressMetrics.estimatedCompletion).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Blockers */}
        {health.blockers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Blockers
            </h4>
            <ul className="space-y-1">
              {health.blockers.map((blocker, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  • {blocker}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {health.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Recommendations
            </h4>
            <ul className="space-y-1">
              {health.recommendations.map((recommendation, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  • {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}