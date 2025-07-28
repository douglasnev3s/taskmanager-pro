"use client"

import { useAppSelector } from '@/store/hooks';
import { 
  selectProjectStats,
  selectOverdueProjects,
  selectHighPriorityProjects,
  selectRecentProjects,
  selectProjectsByStatus,
  selectProjectsByCategory,
  selectProjectsByPriority
} from '@/store/selectors';
import { Project, ProjectStatus, ProjectPriority, ProjectCategory } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Target,
  Users,
  Calendar,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';

interface ProjectMetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function ProjectMetricCard({ title, value, description, icon: Icon, color = "text-blue-600", trend }: ProjectMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div className={`flex items-center text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectListCardProps {
  title: string;
  projects: Project[];
  icon: any;
  emptyMessage: string;
  maxItems?: number;
}

function ProjectListCard({ title, projects, icon: Icon, emptyMessage, maxItems = 5 }: ProjectListCardProps) {
  const displayProjects = projects.slice(0, maxItems);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE: return 'bg-green-100 text-green-800';
      case ProjectStatus.COMPLETED: return 'bg-blue-100 text-blue-800';
      case ProjectStatus.ON_HOLD: return 'bg-yellow-100 text-yellow-800';
      case ProjectStatus.ARCHIVED: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.CRITICAL: return 'bg-red-100 text-red-800';
      case ProjectPriority.HIGH: return 'bg-orange-100 text-orange-800';
      case ProjectPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case ProjectPriority.LOW: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
          <Badge variant="secondary">{projects.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayProjects.length > 0 ? (
          <div className="space-y-3">
            {displayProjects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{project.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className={`text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                      <Badge variant="secondary" className={`text-xs ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium">{project.progress}%</div>
                  <Progress value={project.progress} className="w-16 h-2 mt-1" />
                </div>
              </div>
            ))}
            {projects.length > maxItems && (
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  +{projects.length - maxItems} more projects
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Icon className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DistributionChartProps {
  title: string;
  data: Record<string, Project[]>;
  icon: any;
  getColorForKey: (key: string) => string;
}

function DistributionChart({ title, data, icon: Icon, getColorForKey }: DistributionChartProps) {
  const total = Object.values(data).reduce((sum, projects) => sum + projects.length, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(data).map(([key, projects]) => {
            const percentage = total > 0 ? Math.round((projects.length / total) * 100) : 0;
            const color = getColorForKey(key);
            
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{projects.length}</span>
                  <div className="w-16">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectDashboardPage() {
  const stats = useAppSelector(selectProjectStats);
  const overdueProjects = useAppSelector(selectOverdueProjects);
  const highPriorityProjects = useAppSelector(selectHighPriorityProjects);
  const recentProjects = useAppSelector(selectRecentProjects);
  const projectsByStatus = useAppSelector(selectProjectsByStatus);
  const projectsByCategory = useAppSelector(selectProjectsByCategory);
  const projectsByPriority = useAppSelector(selectProjectsByPriority);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'completed': return '#3B82F6';
      case 'on-hold': return '#F59E0B';
      case 'archived': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return '#EC4899';
      case 'work': return '#3B82F6';
      case 'learning': return '#10B981';
      case 'side-project': return '#8B5CF6';
      case 'client-work': return '#F59E0B';
      case 'open-source': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#EF4444';
      case 'high': return '#F97316';
      case 'medium': return '#F59E0B';
      case 'low': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Project Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your project portfolio and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProjectMetricCard
          title="Total Projects"
          value={stats.total}
          description="Active projects"
          icon={Target}
          color="text-blue-600"
          trend={{ value: 12, isPositive: true }}
        />
        <ProjectMetricCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          description="Projects completed"
          icon={CheckCircle2}
          color="text-green-600"
          trend={{ value: 8, isPositive: true }}
        />
        <ProjectMetricCard
          title="Average Progress"
          value={`${stats.averageProgress}%`}
          description="Across all projects"
          icon={Activity}
          color="text-purple-600"
          trend={{ value: 5, isPositive: true }}
        />
        <ProjectMetricCard
          title="Overdue Projects"
          value={stats.overdue}
          description="Need attention"
          icon={AlertTriangle}
          color="text-red-600"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Project Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectListCard
          title="Overdue Projects"
          projects={overdueProjects}
          icon={AlertTriangle}
          emptyMessage="No overdue projects! Great job staying on track."
        />
        <ProjectListCard
          title="High Priority Projects"
          projects={highPriorityProjects}
          icon={TrendingUp}
          emptyMessage="No high priority projects at the moment."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectListCard
          title="Recent Projects"
          projects={recentProjects}
          icon={Calendar}
          emptyMessage="No recent projects created."
        />
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Projects</span>
                <div className="flex items-center space-x-2">
                  <Progress value={(stats.active / stats.total) * 100} className="w-20 h-2" />
                  <span className="text-sm font-medium">{stats.active}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed Projects</span>
                <div className="flex items-center space-x-2">
                  <Progress value={(stats.completed / stats.total) * 100} className="w-20 h-2" />
                  <span className="text-sm font-medium">{stats.completed}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">On Hold Projects</span>
                <div className="flex items-center space-x-2">
                  <Progress value={(stats.onHold / stats.total) * 100} className="w-20 h-2" />
                  <span className="text-sm font-medium">{stats.onHold}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DistributionChart
          title="Projects by Status"
          data={projectsByStatus}
          icon={PieChart}
          getColorForKey={getStatusColor}
        />
        <DistributionChart
          title="Projects by Category"
          data={projectsByCategory}
          icon={Users}
          getColorForKey={getCategoryColor}
        />
        <DistributionChart
          title="Projects by Priority"
          data={projectsByPriority}
          icon={Clock}
          getColorForKey={getPriorityColor}
        />
      </div>
    </div>
  );
}