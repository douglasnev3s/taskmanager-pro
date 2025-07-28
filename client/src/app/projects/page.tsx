"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  selectSortedProjects,
  selectProjectStats,
  selectProjectsLoading,
  selectProjectView,
  selectShowArchived,
  selectProjectFilter
} from '@/store/selectors';
import { 
  setProjectView,
  setShowArchived,
  setProjectFilter,
  setShowCreateProjectModal,
  setSelectedProject,
  setShowProjectModal
} from '@/store/slices/projectsSlice';
import { Project, ProjectStatus, ProjectPriority } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ProjectTemplateModal, ProjectHealthCard, ProjectTimeline, ProjectShareModal } from '@/components/projects';
import { useProjectProgress } from '@/hooks/useProjectProgress';
import { selectAllTasks } from '@/store/selectors';

import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Calendar,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  FileText,
  Share2
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onShare: (project: Project) => void;
  view: 'grid' | 'list' | 'timeline';
}

function ProjectCard({ project, onView, onShare, view }: ProjectCardProps) {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'text-green-600 bg-green-100';
      case ProjectStatus.COMPLETED:
        return 'text-blue-600 bg-blue-100';
      case ProjectStatus.ON_HOLD:
        return 'text-yellow-600 bg-yellow-100';
      case ProjectStatus.ARCHIVED:
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case ProjectPriority.CRITICAL:
        return 'text-red-600 bg-red-100';
      case ProjectPriority.HIGH:
        return 'text-orange-600 bg-orange-100';
      case ProjectPriority.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case ProjectPriority.LOW:
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== ProjectStatus.COMPLETED;

  if (view === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(project)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: project.color }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm font-medium">{project.progress}%</p>
                <Progress value={project.progress} className="w-20" />
              </div>
              <Badge className={getPriorityColor(project.priority)}>
                {project.priority}
              </Badge>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(project);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-md transition-all cursor-pointer" onClick={() => onView(project)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: project.color }}
            />
            <div>
              <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getPriorityColor(project.priority)} variant="secondary">
                  {project.priority}
                </Badge>
                <Badge className={getStatusColor(project.status)} variant="secondary">
                  {project.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(project);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            {isOverdue && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="mb-4 line-clamp-2">
          {project.description}
        </CardDescription>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{project.members.length} members</span>
            </div>
            {project.deadline && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>
                  Due {new Date(project.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard({ title, value, icon: Icon, description }: {
  title: string;
  value: string | number;
  icon: any;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectSortedProjects);
  const stats = useAppSelector(selectProjectStats);
  const loading = useAppSelector(selectProjectsLoading);
  const view = useAppSelector(selectProjectView);
  const showArchived = useAppSelector(selectShowArchived);
  const filter = useAppSelector(selectProjectFilter);
  const tasks = useAppSelector(selectAllTasks);

  const [searchQuery, setSearchQuery] = useState(filter.search || '');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedShareProject, setSelectedShareProject] = useState<Project | null>(null);
  
  // Initialize automatic project progress tracking
  useProjectProgress();

  const handleCreateProject = () => {
    dispatch(setShowCreateProjectModal(true));
  };

  const handleUseTemplate = () => {
    setShowTemplateModal(true);
  };

  const handleViewProject = (project: Project) => {
    dispatch(setSelectedProject(project));
    dispatch(setShowProjectModal(true));
  };

  const handleViewChange = (newView: 'grid' | 'list' | 'timeline') => {
    dispatch(setProjectView(newView));
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    dispatch(setProjectFilter({ search: query }));
  };

  const handleToggleArchived = () => {
    dispatch(setShowArchived(!showArchived));
  };

  const handleShareProject = (project: Project) => {
    setSelectedShareProject(project);
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Organize and track your work with projects
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/projects/archive">
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Link>
          </Button>
          <Button variant="outline" onClick={handleUseTemplate}>
            <FileText className="w-4 h-4 mr-2" />
            Use Template
          </Button>
          <Button onClick={handleCreateProject}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={stats.total}
          icon={Grid3X3}
          description="Active projects"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          description={`${stats.completionRate}% completion rate`}
        />
        <StatsCard
          title="In Progress"
          value={stats.active}
          icon={TrendingUp}
          description="Currently active"
        />
        <StatsCard
          title="Average Progress"
          value={`${stats.averageProgress}%`}
          icon={Clock}
          description="Across all projects"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-80"
            />
          </div>

          {/* Archive Toggle */}
          <Button
            variant={showArchived ? "default" : "outline"}
            size="sm"
            onClick={handleToggleArchived}
          >
            <Archive className="w-4 h-4 mr-2" />
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex border rounded-md p-1">
          <Button
            variant={view === 'grid' ? 'default' : 'ghost'}
            size="sm"
            className="px-3"
            onClick={() => handleViewChange('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="px-3"
            onClick={() => handleViewChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            className="px-3"
            onClick={() => handleViewChange('timeline')}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects */}
      <div>
        {view === 'timeline' ? (
          <ProjectTimeline projects={projects} tasks={tasks} />
        ) : projects.length > 0 ? (
          <div className={
            view === 'list' 
              ? "space-y-4"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          }>
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={handleViewProject}
                onShare={handleShareProject}
                view={view}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Grid3X3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {showArchived 
                ? 'No archived projects to display' 
                : searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Create your first project to get started'
              }
            </p>
            {!searchQuery && !showArchived && (
              <Button onClick={handleCreateProject}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Project Template Modal */}
      <ProjectTemplateModal 
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
      />

      {/* Project Share Modal */}
      {selectedShareProject && (
        <ProjectShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSelectedShareProject(null);
          }}
          project={selectedShareProject}
        />
      )}
    </div>
  );
}