"use client"

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { bulkArchiveProjects, bulkRestoreProjects, bulkDeleteProjects } from '@/store/slices/projectsSlice';
import { Project } from '@/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProjectArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  mode: 'archive' | 'restore' | 'delete';
  title: string;
  description: string;
}

export function ProjectArchiveModal({ 
  isOpen, 
  onClose, 
  projects, 
  mode, 
  title, 
  description 
}: ProjectArchiveModalProps) {
  const dispatch = useAppDispatch();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectProject = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects(prev => [...prev, projectId]);
    } else {
      setSelectedProjects(prev => prev.filter(id => id !== projectId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(projects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSubmit = async () => {
    if (selectedProjects.length === 0) {
      toast.error('Please select at least one project');
      return;
    }

    setLoading(true);
    
    try {
      switch (mode) {
        case 'archive':
          dispatch(bulkArchiveProjects(selectedProjects));
          toast.success(`${selectedProjects.length} project(s) archived successfully`);
          break;
        case 'restore':
          dispatch(bulkRestoreProjects(selectedProjects));
          toast.success(`${selectedProjects.length} project(s) restored successfully`);
          break;
        case 'delete':
          dispatch(bulkDeleteProjects(selectedProjects));
          toast.success(`${selectedProjects.length} project(s) deleted permanently`);
          break;
      }
      
      setSelectedProjects([]);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${mode} projects`);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'archive': return <Archive className="h-5 w-5" />;
      case 'restore': return <ArchiveRestore className="h-5 w-5" />;
      case 'delete': return <Trash2 className="h-5 w-5" />;
    }
  };

  const getButtonColor = () => {
    switch (mode) {
      case 'archive': return 'default';
      case 'restore': return 'default';
      case 'delete': return 'destructive';
    }
  };

  const getStatusIcon = (project: Project) => {
    switch (project.status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'on-hold': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'archived': return <Archive className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'on-hold': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleClose = () => {
    setSelectedProjects([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Select All Checkbox */}
          <div className="flex items-center gap-2 pb-2 border-b">
            <Checkbox
              id="select-all"
              checked={selectedProjects.length === projects.length && projects.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All ({projects.length} projects)
            </label>
          </div>

          {/* Projects List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Archive className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No projects available for {mode}</p>
              </div>
            ) : (
              projects.map((project) => (
                <div 
                  key={project.id} 
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50"
                >
                  <Checkbox
                    id={project.id}
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={(checked) => handleSelectProject(project.id, checked as boolean)}
                  />
                  
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: project.color }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{project.name}</h4>
                      <Badge className={getStatusColor(project.status)} variant="secondary">
                        {project.status}
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(project)}
                        Progress: {project.progress}%
                      </span>
                      {project.deadline && (
                        <span>
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selected Projects Summary */}
          {selectedProjects.length > 0 && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                <strong>{selectedProjects.length}</strong> project(s) selected for {mode}
              </p>
              {mode === 'delete' && (
                <p className="text-xs text-destructive mt-1">
                  ⚠️ This action cannot be undone. Deleted projects will be permanently removed.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant={getButtonColor() as any}
            onClick={handleSubmit}
            disabled={selectedProjects.length === 0 || loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {getIcon()}
                {mode === 'archive' && 'Archive Selected'}
                {mode === 'restore' && 'Restore Selected'}
                {mode === 'delete' && 'Delete Selected'}
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}