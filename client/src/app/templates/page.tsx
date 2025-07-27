"use client"

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  selectTemplates,
  selectTemplatesByCategory,
  selectPopularTemplates,
  selectRecentlyUsedTemplates,
  selectTemplateStats
} from '@/store/selectors';
import { 
  setSelectedTemplate,
  setShowTemplateModal,
  setShowCreateTemplateModal,
  duplicateTemplate
} from '@/store/slices/templatesSlice';
import { TaskTemplate, TemplateCategory } from '@/types';
import { getCategoryColor, getCategoryIcon, calculateTemplateDuration } from '@/data/templates';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateSelectionModal, CreateTemplateModal } from '@/components/templates';

import { 
  Plus, 
  Search, 
  Clock, 
  CheckSquare, 
  Star, 
  Copy,
  TrendingUp,
  Bookmark,
  Zap
} from 'lucide-react';

interface TemplateCardProps {
  template: TaskTemplate;
  onUse: (template: TaskTemplate) => void;
  onDuplicate?: (templateId: string) => void;
  showActions?: boolean;
}

function TemplateCard({ template, onUse, onDuplicate, showActions = true }: TemplateCardProps) {
  const categoryColor = getCategoryColor(template.category);
  const categoryIcon = getCategoryIcon(template.category);
  const duration = calculateTemplateDuration(template.tasks);

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{categoryIcon}</span>
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="secondary"
                  style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                >
                  {template.category}
                </Badge>
                {template.difficulty && (
                  <Badge variant="outline">{template.difficulty}</Badge>
                )}
                {template.usageCount && template.usageCount > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4" />
                    <span>{template.usageCount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {showActions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              {onDuplicate && !template.isBuiltIn && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(template.id);
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 line-clamp-2">
          {template.description}
        </CardDescription>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <CheckSquare className="w-4 h-4" />
            <span>{template.tasks.length} tasks</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 4}
            </Badge>
          )}
        </div>
        <Button onClick={() => onUse(template)} className="w-full">
          Use Template
        </Button>
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

export default function TemplatesPage() {
  const dispatch = useAppDispatch();
  const templates = useAppSelector(selectTemplates);
  const templatesByCategory = useAppSelector(selectTemplatesByCategory);
  const popularTemplates = useAppSelector(selectPopularTemplates);
  const recentlyUsed = useAppSelector(selectRecentlyUsedTemplates);
  const stats = useAppSelector(selectTemplateStats);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleUseTemplate = (template: TaskTemplate) => {
    dispatch(setSelectedTemplate(template));
    dispatch(setShowTemplateModal(true));
  };

  const handleCreateTemplate = () => {
    dispatch(setShowCreateTemplateModal(true));
  };

  const handleDuplicateTemplate = (templateId: string) => {
    dispatch(duplicateTemplate(templateId));
  };

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    ...Object.entries(templatesByCategory).map(([category, categoryTemplates]) => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: categoryTemplates.length
    }))
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Pre-built workflows and custom templates to boost your productivity
          </p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Templates"
          value={stats.total}
          icon={Bookmark}
          description="Available templates"
        />
        <StatsCard
          title="Custom Templates"
          value={stats.custom}
          icon={Zap}
          description="Created by you"
        />
        <StatsCard
          title="Total Usage"
          value={stats.totalUsage}
          icon={TrendingUp}
          description="Times templates used"
        />
        <StatsCard
          title="Avg Tasks"
          value={stats.averageTasksPerTemplate}
          icon={CheckSquare}
          description="Tasks per template"
        />
      </div>

      {/* Quick Access */}
      {(popularTemplates.length > 0 || recentlyUsed.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Templates */}
          {popularTemplates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Popular Templates
              </h3>
              <div className="space-y-3">
                {popularTemplates.slice(0, 3).map(template => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-sm" onClick={() => handleUseTemplate(template)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getCategoryIcon(template.category)}</span>
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {template.tasks.length} tasks • Used {template.usageCount} times
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recently Used */}
          {recentlyUsed.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recently Used
              </h3>
              <div className="space-y-3">
                {recentlyUsed.slice(0, 3).map(template => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-sm" onClick={() => handleUseTemplate(template)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getCategoryIcon(template.category)}</span>
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {template.tasks.length} tasks • {calculateTemplateDuration(template.tasks)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map(category => (
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
      <div>
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUseTemplate}
                onDuplicate={handleDuplicateTemplate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'No templates match the selected category'}
            </p>
            <Button onClick={handleCreateTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Template
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <TemplateSelectionModal />
      <CreateTemplateModal />
    </div>
  );
}