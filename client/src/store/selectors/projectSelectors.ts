import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { ProjectStatus, ProjectPriority, ProjectCategory, Project, ProjectStats } from '@/types';

// Base selectors
export const selectProjectsState = (state: RootState) => state.projects;
export const selectProjects = (state: RootState) => state.projects.projects;
export const selectSelectedProject = (state: RootState) => state.projects.selectedProject;
export const selectProjectsLoading = (state: RootState) => state.projects.loading;
export const selectProjectsError = (state: RootState) => state.projects.error;
export const selectProjectFilter = (state: RootState) => state.projects.filter;
export const selectProjectSortBy = (state: RootState) => state.projects.sortBy;
export const selectProjectSortOrder = (state: RootState) => state.projects.sortOrder;
export const selectProjectView = (state: RootState) => state.projects.view;
export const selectShowArchived = (state: RootState) => state.projects.showArchived;
export const selectShowProjectModal = (state: RootState) => state.projects.showProjectModal;
export const selectShowCreateProjectModal = (state: RootState) => state.projects.showCreateProjectModal;

// Computed selectors
export const selectActiveProjects = createSelector(
  [selectProjects, selectShowArchived],
  (projects, showArchived) => {
    if (showArchived) return projects;
    return projects.filter(project => !project.isArchived);
  }
);

export const selectArchivedProjects = createSelector(
  [selectProjects],
  (projects) => projects.filter(project => project.isArchived)
);

export const selectProjectsByStatus = createSelector(
  [selectActiveProjects],
  (projects) => {
    const grouped: Record<ProjectStatus, Project[]> = {
      [ProjectStatus.ACTIVE]: [],
      [ProjectStatus.COMPLETED]: [],
      [ProjectStatus.ON_HOLD]: [],
      [ProjectStatus.ARCHIVED]: []
    };

    projects.forEach(project => {
      grouped[project.status].push(project);
    });

    return grouped;
  }
);

export const selectProjectsByCategory = createSelector(
  [selectActiveProjects],
  (projects) => {
    const grouped: Record<ProjectCategory, Project[]> = {
      [ProjectCategory.PERSONAL]: [],
      [ProjectCategory.WORK]: [],
      [ProjectCategory.LEARNING]: [],
      [ProjectCategory.SIDE_PROJECT]: [],
      [ProjectCategory.CLIENT_WORK]: [],
      [ProjectCategory.OPEN_SOURCE]: []
    };

    projects.forEach(project => {
      grouped[project.category].push(project);
    });

    return grouped;
  }
);

export const selectProjectsByPriority = createSelector(
  [selectActiveProjects],
  (projects) => {
    const grouped: Record<ProjectPriority, Project[]> = {
      [ProjectPriority.LOW]: [],
      [ProjectPriority.MEDIUM]: [],
      [ProjectPriority.HIGH]: [],
      [ProjectPriority.CRITICAL]: []
    };

    projects.forEach(project => {
      grouped[project.priority].push(project);
    });

    return grouped;
  }
);

export const selectFilteredProjects = createSelector(
  [selectActiveProjects, selectProjectFilter],
  (projects, filter) => {
    let filtered = projects;

    // Search filter
    if (filter.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(search) ||
        project.description?.toLowerCase().includes(search) ||
        project.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Status filter
    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(project => filter.status!.includes(project.status));
    }

    // Priority filter
    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter(project => filter.priority!.includes(project.priority));
    }

    // Category filter
    if (filter.category && filter.category.length > 0) {
      filtered = filtered.filter(project => filter.category!.includes(project.category));
    }

    // Date range filter (future implementation)
    // if (filter.dateRange) {
    //   const { start, end } = filter.dateRange;
    //   filtered = filtered.filter(project => {
    //     const projectDate = new Date(project.createdAt);
    //     return projectDate >= start && projectDate <= end;
    //   });
    // }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(project =>
        filter.tags!.some(tag => project.tags.includes(tag))
      );
    }

    // Member filter
    if (filter.memberIds && filter.memberIds.length > 0) {
      filtered = filtered.filter(project =>
        project.members.some(member => filter.memberIds!.includes(member.id))
      );
    }

    return filtered;
  }
);

export const selectSortedProjects = createSelector(
  [selectFilteredProjects, selectProjectSortBy, selectProjectSortOrder],
  (projects, sortBy, sortOrder) => {
    const sorted = [...projects].sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'deadline':
          const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          compareValue = aDeadline - bDeadline;
          break;
        case 'progress':
          compareValue = a.progress - b.progress;
          break;
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          compareValue = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        default:
          compareValue = 0;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }
);

export const selectProjectStats = createSelector(
  [selectProjects],
  (projects): ProjectStats => {
    const active = projects.filter(p => !p.isArchived);
    const total = active.length;
    const completed = active.filter(p => p.status === ProjectStatus.COMPLETED).length;
    const onHold = active.filter(p => p.status === ProjectStatus.ON_HOLD).length;
    const archived = projects.filter(p => p.isArchived).length;
    
    // Calculate overdue projects
    const now = new Date();
    const overdue = active.filter(p => 
      p.deadline && 
      new Date(p.deadline) < now && 
      p.status !== ProjectStatus.COMPLETED
    ).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const averageProgress = total > 0 
      ? Math.round(active.reduce((sum, p) => sum + p.progress, 0) / total) 
      : 0;

    return {
      total,
      active: active.filter(p => p.status === ProjectStatus.ACTIVE).length,
      completed,
      onHold,
      archived,
      overdue,
      completionRate,
      averageProgress,
    };
  }
);

export const selectOverdueProjects = createSelector(
  [selectActiveProjects],
  (projects) => {
    const now = new Date();
    return projects.filter(project =>
      project.deadline &&
      new Date(project.deadline) < now &&
      project.status !== ProjectStatus.COMPLETED
    );
  }
);

export const selectHighPriorityProjects = createSelector(
  [selectActiveProjects],
  (projects) => 
    projects.filter(project => 
      project.priority === ProjectPriority.HIGH || 
      project.priority === ProjectPriority.CRITICAL
    )
);

export const selectRecentProjects = createSelector(
  [selectActiveProjects],
  (projects) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return projects
      .filter(project => new Date(project.createdAt) > oneWeekAgo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }
);

export const selectProjectById = (projectId: string) =>
  createSelector(
    [selectProjects],
    (projects) => projects.find(project => project.id === projectId)
  );

export const selectProjectOptions = createSelector(
  [selectActiveProjects],
  (projects) => 
    projects.map(project => ({
      value: project.id,
      label: project.name,
      color: project.color,
      category: project.category
    }))
);

export const selectProjectTags = createSelector(
  [selectProjects],
  (projects) => {
    const tagsSet = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }
);

export const selectProjectProgress = (projectId: string) =>
  createSelector(
    [selectProjects, (state: RootState) => state.tasks.tasks],
    (projects, tasks) => {
      const project = projects.find(p => p.id === projectId);
      if (!project) return null;

      const projectTasks = tasks.filter(task => task.projectId === projectId);
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
      const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress').length;
      const todoTasks = projectTasks.filter(task => task.status === 'todo').length;
      
      const now = new Date();
      const overdueTasks = projectTasks.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) < now && 
        task.status !== 'completed'
      ).length;

      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        projectId,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        progressPercentage,
        estimatedCompletion: project.deadline,
        velocity: 0, // Calculate based on completed tasks per week
      };
    }
  );

export const selectProjectMembers = createSelector(
  [selectProjects],
  (projects) => {
    const membersMap = new Map();
    
    projects.forEach(project => {
      project.members.forEach(member => {
        if (!membersMap.has(member.id)) {
          membersMap.set(member.id, member);
        }
      });
    });
    
    return Array.from(membersMap.values());
  }
);