"use client"

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectArchivedProjects, selectProjectsLoading } from '@/store/selectors';
import { Project } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProjectArchiveModal } from '@/components/projects/ProjectArchiveModal';

import {
  Archive,
  ArchiveRestore,
  Search,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectArchivePage() {
  const dispatch = useAppDispatch();
  const archivedProjects = useAppSelector(selectArchivedProjects);
  const loading = useAppSelector(selectProjectsLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter archived projects by search query
  const filteredProjects = archivedProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectProject = (project: Project, selected: boolean) => {
    if (selected) {
      setSelectedProjects(prev => [...prev, project]);
    } else {
      setSelectedProjects(prev => prev.filter(p => p.id !== project.id));
    }
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects);
    }
  };

  const getStatusIcon = (project: Project) => {
    switch (project.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'on-hold':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Archive className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'on-hold':
        return 'text-yellow-600 bg-yellow-100';
      case 'archived':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysArchived = (archivedDate: string) => {
    const archived = new Date(archivedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - archived.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Archive className="h-8 w-8" />
            Project Archive
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage archived projects - restore or permanently delete them
          </p>
        </div>
        
        {selectedProjects.length > 0 && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowRestoreModal(true)}
              className="flex items-center gap-2"
            >
              <ArchiveRestore className="h-4 w-4" />
              Restore ({selectedProjects.length})
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedProjects.length})
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived Projects</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{archivedProjects.length}</div>
            <p className="text-xs text-muted-foreground">Total archived</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {archivedProjects.filter(p => p.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Finished projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Hold</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {archivedProjects.filter(p => p.status === 'on-hold').length}
            </div>
            <p className="text-xs text-muted-foreground">Paused projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedProjects.length}</div>
            <p className="text-xs text-muted-foreground">For bulk actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search archived projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {filteredProjects.length > 0 && (
          <Button variant="outline" onClick={handleSelectAll}>
            {selectedProjects.length === filteredProjects.length ? 'Deselect All' : 'Select All'}
          </Button>
        )}
      </div>

      {/* Archived Projects List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading archived projects...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'No matching archived projects' : 'No archived projects'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Archived projects will appear here when you archive them from the main projects page'
              }
            </p>
            {!searchQuery && (
              <Link href="/projects">
                <Button>
                  Go to Projects
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedProjects.some(p => p.id === project.id) 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : ''
              }`}
              onClick={() => handleSelectProject(
                project, 
                !selectedProjects.some(p => p.id === project.id)
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-1" 
                      style={{ backgroundColor: project.color }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                        <Badge className={getStatusColor(project.status)} variant="secondary">
                          {project.status}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 text-gray-700">
                          Archived
                        </Badge>
                      </div>
                      
                      {project.description && (
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(project)}
                          <span>Progress: {project.progress}%</span>
                        </div>
                        
                        {project.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {formatDate(project.deadline)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Archive className="h-4 w-4" />
                          <span>
                            Archived {calculateDaysArchived(project.updatedAt)} days ago
                          </span>
                        </div>
                      </div>
                      
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {project.tags.slice(0, 5).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 5}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjects([project]);
                        setShowRestoreModal(true);
                      }}
                    >
                      <ArchiveRestore className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjects([project]);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Restore Modal */}
      <ProjectArchiveModal
        isOpen={showRestoreModal}
        onClose={() => {
          setShowRestoreModal(false);
          setSelectedProjects([]);
        }}
        projects={selectedProjects}
        mode="restore"
        title="Restore Projects"
        description="Restore the selected projects from archive. They will be reactivated and moved back to the main projects list."
      />

      {/* Delete Modal */}
      <ProjectArchiveModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProjects([]);
        }}
        projects={selectedProjects}
        mode="delete"
        title="Delete Projects Permanently"
        description="⚠️ This will permanently delete the selected projects. This action cannot be undone. All project data, tasks, and history will be lost."
      />
    </div>
  );
}