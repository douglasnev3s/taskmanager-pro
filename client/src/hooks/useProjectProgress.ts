"use client"

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectAllTasks } from '@/store/selectors';
import { recalculateProjectProgress } from '@/store/slices/projectsSlice';

/**
 * Hook to automatically recalculate project progress when tasks change
 */
export function useProjectProgress() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  
  useEffect(() => {
    // Group tasks by project and recalculate progress for each project
    const tasksByProject = tasks?.reduce((acc, task) => {
      if (task.projectId) {
        if (!acc[task.projectId]) {
          acc[task.projectId] = [];
        }
        acc[task.projectId].push(task);
      }
      return acc;
    }, {} as Record<string, typeof tasks>) || {};

    // Recalculate progress for each project that has tasks
    Object.entries(tasksByProject).forEach(([projectId, projectTasks]) => {
      dispatch(recalculateProjectProgress({
        projectId,
        tasks: projectTasks
      }));
    });
  }, [tasks, dispatch]);
}

/**
 * Hook to manually trigger project progress recalculation for a specific project
 */
export function useRecalculateProjectProgress() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  
  return (projectId: string) => {
    const projectTasks = tasks?.filter(task => task.projectId === projectId) || [];
    dispatch(recalculateProjectProgress({
      projectId,
      tasks: projectTasks
    }));
  };
}