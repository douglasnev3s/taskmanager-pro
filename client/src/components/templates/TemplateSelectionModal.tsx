"use client"

import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  selectTemplates, 
  selectSelectedTemplate, 
  selectShowTemplateModal,
  selectTemplatesByCategory 
} from '@/store/selectors';
import { 
  setSelectedTemplate, 
  setShowTemplateModal, 
  applyTemplate 
} from '@/store/slices/templatesSlice';
import { createTask } from '@/store/slices/tasksSlice';
import { TaskTemplate, TemplateCategory, ApplyTemplateOptions } from '@/types';
import { getCategoryColor, getCategoryIcon, calculateTemplateDuration } from '@/data/templates';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

import { 
  Search, 
  Clock, 
  CheckSquare, 
  Star, 
  Calendar as CalendarIcon,
  Settings,
  Copy,
  Bookmark
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: TaskTemplate;
  onSelect: (template: TaskTemplate) => void;
  isSelected: boolean;
}

function TemplateCard({ template, onSelect, isSelected }: TemplateCardProps) {
  const categoryColor = getCategoryColor(template.category);
  const categoryIcon = getCategoryIcon(template.category);
  const duration = calculateTemplateDuration(template.tasks);

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{categoryIcon}</span>
            <div>
              <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                >
                  {template.category}
                </Badge>
                {template.difficulty && (
                  <Badge variant="outline" className="text-xs">
                    {template.difficulty}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {template.usageCount && template.usageCount > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3" />
              <span>{template.usageCount}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs mb-3 line-clamp-2">
          {template.description}
        </CardDescription>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <CheckSquare className="w-3 h-3" />
            <span>{template.tasks.length} tasks</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{duration}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TemplatePreviewProps {
  template: TaskTemplate;
}

function TemplatePreview({ template }: TemplatePreviewProps) {
  const categoryColor = getCategoryColor(template.category);
  const categoryIcon = getCategoryIcon(template.category);
  const duration = calculateTemplateDuration(template.tasks);

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{categoryIcon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{template.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge 
              variant="secondary"
              style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
            >
              {template.category}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <CheckSquare className="w-4 h-4" />
              <span>{template.tasks.length} tasks</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-medium text-sm mb-3">Tasks Preview</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {template.tasks.map((task, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 rounded-md bg-muted/50">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{task.title}</p>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {task.priority}
                  </Badge>
                  {task.estimatedDuration && (
                    <span className="text-xs text-muted-foreground">
                      ~{task.estimatedDuration}
                    </span>
                  )}
                  {task.isOptional && (
                    <Badge variant="secondary" className="text-xs">
                      Optional
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {template.tags.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium text-sm mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {template.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function TemplateSelectionModal() {
  const dispatch = useAppDispatch();
  const templates = useAppSelector(selectTemplates);
  const selectedTemplate = useAppSelector(selectSelectedTemplate);
  const isOpen = useAppSelector(selectShowTemplateModal);
  const templatesByCategory = useAppSelector(selectTemplatesByCategory);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>();
  const [projectName, setProjectName] = useState('');
  const [skipOptional, setSkipOptional] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    return filtered;
  }, [templates, searchQuery, selectedCategory]);

  const handleClose = () => {
    dispatch(setShowTemplateModal(false));
    setSearchQuery('');
    setSelectedCategory('all');
    setStartDate(undefined);
    setProjectName('');
    setSkipOptional(false);
  };

  const handleSelectTemplate = (template: TaskTemplate) => {
    dispatch(setSelectedTemplate(template));
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;

    const options: ApplyTemplateOptions = {
      templateId: selectedTemplate.id,
      startDate,
      projectName: projectName.trim() || undefined,
      customizations: {
        skipOptional
      }
    };

    try {
      const result = await dispatch(applyTemplate(options)).unwrap();
      
      // Create actual tasks from the template
      for (const task of result) {
        await dispatch(createTask({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          tags: task.tags
        }));
      }

      handleClose();
    } catch (error) {
      console.error('Failed to apply template:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    ...Object.entries(templatesByCategory).map(([category, categoryTemplates]) => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: categoryTemplates.length
    }))
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex space-x-6 overflow-hidden">
          {/* Template Selection */}
          <div className="flex-1 flex flex-col">
            <div className="space-y-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-4">
                  {categories.slice(0, 4).map(category => (
                    <TabsTrigger key={category.id} value={category.id} className="text-xs">
                      {category.name}
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {category.count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Templates Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredTemplates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleSelectTemplate}
                    isSelected={selectedTemplate?.id === template.id}
                  />
                ))}
              </div>
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No templates found matching your criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Template Preview and Options */}
          {selectedTemplate && (
            <div className="w-96 flex flex-col border-l pl-6">
              <div className="flex-1 overflow-y-auto">
                <TemplatePreview template={selectedTemplate} />
              </div>

              <div className="mt-6 space-y-4 border-t pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Project Name (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Frontend Developer Position"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Start Date (Optional)
                  </label>
                  <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skip-optional"
                    checked={skipOptional}
                    onCheckedChange={(checked) => setSkipOptional(!!checked)}
                  />
                  <label htmlFor="skip-optional" className="text-sm">
                    Skip optional tasks
                  </label>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleApplyTemplate} className="flex-1">
                    Apply Template
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}