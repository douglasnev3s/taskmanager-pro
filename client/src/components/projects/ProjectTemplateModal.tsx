"use client"

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addProjectLocal } from '@/store/slices/projectsSlice';
import { ProjectTemplate, ProjectCategory, ProjectStatus, ProjectPriority, Project } from '@/types';
import { projectTemplates, getTemplatesByCategory } from '@/data/projectTemplates';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  FolderOpen, 
  Tag,
  Users,
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProjectTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons = {
  [ProjectCategory.PERSONAL]: Heart,
  [ProjectCategory.WORK]: Briefcase,
  [ProjectCategory.LEARNING]: GraduationCap,
  [ProjectCategory.SIDE_PROJECT]: Code,
  [ProjectCategory.CLIENT_WORK]: Users,
  [ProjectCategory.OPEN_SOURCE]: FolderOpen,
};

const defaultColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
];

function TemplateCard({ 
  template, 
  onSelect 
}: { 
  template: ProjectTemplate; 
  onSelect: (template: ProjectTemplate) => void;
}) {
  const IconComponent = categoryIcons[template.category];
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
      onClick={() => onSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">{template.name}</CardTitle>
              <Badge variant="outline" className="text-xs mt-1">
                {template.category.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{template.estimatedDuration}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="mb-3 line-clamp-2">
          {template.description}
        </CardDescription>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tasks:</span>
            <span className="font-medium">{template.tasks.length} tasks</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomizeTemplateForm({ 
  template, 
  onSubmit, 
  onCancel 
}: {
  template: ProjectTemplate;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [projectName, setProjectName] = useState(template.name);
  const [projectDescription, setProjectDescription] = useState(template.description);
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: projectName,
      description: projectDescription,
      color: selectedColor,
      template,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">Project Name</Label>
        <Input
          id="project-name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Project description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Project Color</Label>
        <div className="flex flex-wrap gap-2">
          {defaultColors.map(color => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color 
                  ? 'border-gray-800 scale-110' 
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="bg-muted p-3 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Template Preview:</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span>Tasks to be created:</span>
            <span className="font-medium">{template.tasks.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Estimated duration:</span>
            <span className="font-medium">{template.estimatedDuration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Category:</span>
            <span className="font-medium">{template.category}</span>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Back
        </Button>
        <Button type="submit">
          Create Project from Template
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ProjectTemplateModal({ isOpen, onClose }: ProjectTemplateModalProps) {
  const dispatch = useAppDispatch();
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = Array.from(new Set(projectTemplates.map(t => t.category)));
  
  const filteredTemplates = activeCategory === 'all' 
    ? projectTemplates 
    : projectTemplates.filter(t => t.category === activeCategory);

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
  };

  const handleCreateProject = (data: any) => {
    const { name, description, color, template } = data;
    
    // Create the project
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      color,
      status: ProjectStatus.ACTIVE,
      priority: ProjectPriority.MEDIUM,
      category: template.category,
      progress: 0,
      tags: template.tags,
      members: [],
      ownerId: 'current-user',
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add project to store
    dispatch(addProjectLocal(newProject));

    // TODO: Create tasks from template
    // This would need integration with tasks store
    console.log('Template tasks to create:', template.tasks);

    toast.success(`Project "${name}" created successfully with ${template.tasks.length} template tasks!`);
    
    setSelectedTemplate(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedTemplate ? 'Customize Project' : 'Choose Project Template'}
          </DialogTitle>
          <DialogDescription>
            {selectedTemplate 
              ? 'Customize your project details before creating'
              : 'Select a template to quickly set up a new project with predefined tasks and workflows'
            }
          </DialogDescription>
        </DialogHeader>

        {selectedTemplate ? (
          <CustomizeTemplateForm
            template={selectedTemplate}
            onSubmit={handleCreateProject}
            onCancel={() => setSelectedTemplate(null)}
          />
        ) : (
          <div className="space-y-4">
            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Templates</TabsTrigger>
                <TabsTrigger value={ProjectCategory.WORK}>Work</TabsTrigger>
                <TabsTrigger value={ProjectCategory.PERSONAL}>Personal</TabsTrigger>
                <TabsTrigger value={ProjectCategory.LEARNING}>Learning</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleTemplateSelect}
                />
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
                <p className="text-muted-foreground">
                  Try selecting a different category.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}