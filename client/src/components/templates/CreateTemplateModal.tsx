"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  selectShowCreateTemplateModal
} from '@/store/selectors';
import { 
  setShowCreateTemplateModal,
  createTemplateFromTasks
} from '@/store/slices/templatesSlice';
import { TemplateCategory, Task } from '@/types';
import { TEMPLATE_CATEGORIES } from '@/data/templates';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Plus, X, CheckSquare } from 'lucide-react';

const createTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  category: z.nativeEnum(TemplateCategory),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
});

type CreateTemplateFormData = z.infer<typeof createTemplateSchema>;

interface TaskSelectionProps {
  tasks: Task[];
  selectedTaskIds: string[];
  onSelectionChange: (taskIds: string[]) => void;
}

function TaskSelection({ tasks, selectedTaskIds, onSelectionChange }: TaskSelectionProps) {
  const handleTaskToggle = (taskId: string) => {
    const isSelected = selectedTaskIds.includes(taskId);
    if (isSelected) {
      onSelectionChange(selectedTaskIds.filter(id => id !== taskId));
    } else {
      onSelectionChange([...selectedTaskIds, taskId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.length === tasks.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(tasks.map(task => task.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Select Tasks to Include</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
        >
          {selectedTaskIds.length === tasks.length ? 'Deselect All' : 'Select All'}
        </Button>
      </div>
      
      <div className="max-h-60 overflow-y-auto border rounded-md">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tasks available</p>
            <p className="text-sm">Create some tasks first to use them in templates</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {tasks.map((task) => (
              <Card key={task.id} className="cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedTaskIds.includes(task.id)}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.status}
                        </Badge>
                        {task.tags.length > 0 && (
                          <div className="flex space-x-1">
                            {task.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {selectedTaskIds.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedTaskIds.length} task{selectedTaskIds.length > 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}

export function CreateTemplateModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectShowCreateTemplateModal);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<CreateTemplateFormData>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: TemplateCategory.CUSTOM,
      tags: [],
    },
  });

  const handleClose = () => {
    dispatch(setShowCreateTemplateModal(false));
    form.reset();
    setSelectedTaskIds([]);
    setTags([]);
    setNewTag('');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      form.setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue('tags', updatedTags);
  };

  const onSubmit = async (data: CreateTemplateFormData) => {
    if (selectedTaskIds.length === 0) {
      form.setError('name', { message: 'Please select at least one task' });
      return;
    }

    try {
      await dispatch(createTemplateFromTasks({
        ...data,
        tags,
        taskIds: selectedTaskIds,
        tasks: tasks.filter(task => selectedTaskIds.includes(task.id))
      })).unwrap();

      handleClose();
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Custom Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col space-y-6">
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="e.g., My Project Workflow"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Describe what this template is for and when to use it..."
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) => form.setValue('category', value as TemplateCategory)}
                  defaultValue={TemplateCategory.CUSTOM}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {form.formState.errors.tags && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.tags.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Task Selection */}
            <TaskSelection
              tasks={tasks}
              selectedTaskIds={selectedTaskIds}
              onSelectionChange={setSelectedTaskIds}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={selectedTaskIds.length === 0 || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}