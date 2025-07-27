import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { TemplateCategory } from '@/types';

// Base selectors
export const selectTemplatesState = (state: RootState) => state.templates;
export const selectTemplates = (state: RootState) => state.templates.templates;
export const selectSelectedTemplate = (state: RootState) => state.templates.selectedTemplate;
export const selectTemplatesLoading = (state: RootState) => state.templates.loading;
export const selectTemplatesError = (state: RootState) => state.templates.error;
export const selectShowTemplateModal = (state: RootState) => state.templates.showTemplateModal;
export const selectShowCreateTemplateModal = (state: RootState) => state.templates.showCreateTemplateModal;

// Computed selectors
export const selectTemplatesByCategory = createSelector(
  [selectTemplates],
  (templates) => {
    const grouped: Record<TemplateCategory, typeof templates> = {
      [TemplateCategory.CAREER]: [],
      [TemplateCategory.LEARNING]: [],
      [TemplateCategory.PROJECT]: [],
      [TemplateCategory.PERSONAL]: [],
      [TemplateCategory.BUSINESS]: [],
      [TemplateCategory.CUSTOM]: []
    };

    templates.forEach(template => {
      grouped[template.category].push(template);
    });

    return grouped;
  }
);

export const selectBuiltInTemplates = createSelector(
  [selectTemplates],
  (templates) => templates.filter(template => template.isBuiltIn)
);

export const selectCustomTemplates = createSelector(
  [selectTemplates],
  (templates) => templates.filter(template => !template.isBuiltIn)
);

export const selectPopularTemplates = createSelector(
  [selectTemplates],
  (templates) => 
    [...templates]
      .filter(template => template.usageCount && template.usageCount > 0)
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 6)
);

export const selectRecentlyUsedTemplates = (state: RootState) => 
  state.templates.recentlyUsed;

export const selectTemplateById = (templateId: string) =>
  createSelector(
    [selectTemplates],
    (templates) => templates.find(template => template.id === templateId)
  );

export const selectTemplatesByTag = (tag: string) =>
  createSelector(
    [selectTemplates],
    (templates) => templates.filter(template => 
      template.tags.some(templateTag => 
        templateTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  );

export const selectTemplateCategories = createSelector(
  [selectTemplates],
  (templates) => {
    const categories = new Set(templates.map(template => template.category));
    return Array.from(categories);
  }
);

export const selectTemplateStats = createSelector(
  [selectTemplates],
  (templates) => ({
    total: templates.length,
    builtIn: templates.filter(t => t.isBuiltIn).length,
    custom: templates.filter(t => !t.isBuiltIn).length,
    totalUsage: templates.reduce((sum, t) => sum + (t.usageCount || 0), 0),
    averageTasksPerTemplate: templates.length > 0 
      ? Math.round(templates.reduce((sum, t) => sum + t.tasks.length, 0) / templates.length)
      : 0
  })
);

export const selectMostUsedTemplate = createSelector(
  [selectTemplates],
  (templates) => 
    templates.reduce((mostUsed, template) => 
      (template.usageCount || 0) > (mostUsed?.usageCount || 0) ? template : mostUsed,
      templates[0]
    )
);

export const selectTemplateSearchResults = (searchQuery: string) =>
  createSelector(
    [selectTemplates],
    (templates) => {
      if (!searchQuery.trim()) return templates;
      
      const query = searchQuery.toLowerCase();
      return templates.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query)) ||
        template.tasks.some(task => 
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        )
      );
    }
  );