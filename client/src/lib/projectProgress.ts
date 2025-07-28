import { Task, Project, ProjectProgress } from '@/types';

export interface ProjectProgressCalculation {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  progressPercentage: number;
  estimatedHoursTotal: number;
  actualHoursTotal: number;
  hoursRemaining: number;
  velocity: number; // tasks completed per week
  estimatedCompletion?: string;
  lastUpdated: string;
}

export interface ProjectHealthMetrics {
  isOnTrack: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  completionTrend: 'ahead' | 'on-time' | 'behind';
  blockers: string[];
  recommendations: string[];
}

/**
 * Calculate comprehensive project progress metrics
 */
export function calculateProjectProgress(
  projectId: string,
  tasks: Task[],
  project?: Project
): ProjectProgressCalculation {
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  const now = new Date();
  
  // Basic counts
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = projectTasks.filter(task => task.status === 'todo').length;
  
  // Overdue tasks (tasks with due date in the past and not completed)
  const overdueTasks = projectTasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < now && 
    task.status !== 'completed'
  ).length;
  
  // Progress percentage
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Hours calculations
  const estimatedHoursTotal = projectTasks.reduce((sum, task) => 
    sum + (task.estimatedHours || 0), 0
  );
  const actualHoursTotal = projectTasks.reduce((sum, task) => 
    sum + (task.actualHours || 0), 0
  );
  const completedTasksHours = projectTasks
    .filter(task => task.status === 'completed')
    .reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  const hoursRemaining = estimatedHoursTotal - completedTasksHours;
  
  // Velocity calculation (tasks completed per week)
  const velocity = calculateVelocity(projectTasks, project);
  
  // Estimated completion date
  const estimatedCompletion = calculateEstimatedCompletion(
    todoTasks + inProgressTasks,
    velocity,
    project
  );
  
  return {
    projectId,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    overdueTasks,
    progressPercentage,
    estimatedHoursTotal,
    actualHoursTotal,
    hoursRemaining,
    velocity,
    estimatedCompletion,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Calculate project health metrics and recommendations
 */
export function calculateProjectHealth(
  progress: ProjectProgressCalculation,
  project?: Project
): ProjectHealthMetrics {
  const { overdueTasks, totalTasks, progressPercentage, velocity } = progress;
  
  // Risk level calculation
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  const overduePercentage = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;
  
  if (overduePercentage > 20 || velocity < 0.5) {
    riskLevel = 'high';
  } else if (overduePercentage > 10 || velocity < 1) {
    riskLevel = 'medium';
  }
  
  // Completion trend
  let completionTrend: 'ahead' | 'on-time' | 'behind' = 'on-time';
  if (project?.deadline) {
    const timeElapsed = getProjectTimeElapsed(project);
    const expectedProgress = timeElapsed * 100;
    
    if (progressPercentage > expectedProgress + 10) {
      completionTrend = 'ahead';
    } else if (progressPercentage < expectedProgress - 10) {
      completionTrend = 'behind';
    }
  }
  
  // Is on track
  const isOnTrack = riskLevel === 'low' && completionTrend !== 'behind';
  
  // Identify blockers
  const blockers: string[] = [];
  if (overdueTasks > 0) {
    blockers.push(`${overdueTasks} overdue tasks need attention`);
  }
  if (velocity < 1) {
    blockers.push('Low task completion velocity');
  }
  if (progress.actualHoursTotal > progress.estimatedHoursTotal * 1.2) {
    blockers.push('Exceeding estimated time budget');
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (overdueTasks > 0) {
    recommendations.push('Focus on completing overdue tasks first');
  }
  if (velocity < 1) {
    recommendations.push('Consider breaking down large tasks or adding resources');
  }
  if (riskLevel === 'high') {
    recommendations.push('Schedule project review meeting to address risks');
  }
  if (progress.hoursRemaining > 0 && project?.deadline) {
    const daysUntilDeadline = getDaysUntilDeadline(project.deadline);
    const hoursPerDay = progress.hoursRemaining / Math.max(daysUntilDeadline, 1);
    if (hoursPerDay > 8) {
      recommendations.push('Consider extending deadline or reducing scope');
    }
  }
  
  return {
    isOnTrack,
    riskLevel,
    completionTrend,
    blockers,
    recommendations,
  };
}

/**
 * Calculate velocity (tasks completed per week)
 */
function calculateVelocity(tasks: Task[], project?: Project): number {
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  if (completedTasks.length === 0 || !project?.startDate) {
    return 0;
  }
  
  const projectStart = new Date(project.startDate);
  const now = new Date();
  const weeksElapsed = Math.max(
    (now.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24 * 7),
    1
  );
  
  return completedTasks.length / weeksElapsed;
}

/**
 * Calculate estimated completion date
 */
function calculateEstimatedCompletion(
  remainingTasks: number,
  velocity: number,
  project?: Project
): string | undefined {
  if (velocity <= 0 || remainingTasks === 0) {
    return undefined;
  }
  
  const weeksToComplete = remainingTasks / velocity;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + (weeksToComplete * 7));
  
  return estimatedDate.toISOString();
}

/**
 * Get project time elapsed as percentage (0-1)
 */
function getProjectTimeElapsed(project: Project): number {
  if (!project.startDate || !project.deadline) {
    return 0;
  }
  
  const start = new Date(project.startDate);
  const end = new Date(project.deadline);
  const now = new Date();
  
  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  
  return Math.max(0, Math.min(1, elapsed / totalDuration));
}

/**
 * Get days until project deadline
 */
function getDaysUntilDeadline(deadline: string): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const timeDiff = deadlineDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
}

/**
 * Update project progress in real-time when tasks change
 */
export function updateProjectProgressAutomatically(
  projectId: string,
  tasks: Task[],
  updateProjectCallback: (projectId: string, progress: number) => void
): ProjectProgressCalculation {
  const progressCalc = calculateProjectProgress(projectId, tasks);
  
  // Update the project progress automatically
  updateProjectCallback(projectId, progressCalc.progressPercentage);
  
  return progressCalc;
}

/**
 * Get progress insights for dashboard
 */
export function getProjectProgressInsights(
  projects: Project[],
  allTasks: Task[]
): {
  totalProjects: number;
  averageProgress: number;
  projectsAtRisk: number;
  completionRate: number;
  topPerformingProjects: Project[];
  projectsNeedingAttention: Project[];
} {
  const activeProjects = projects.filter(p => !p.isArchived);
  
  let totalProgress = 0;
  let projectsAtRisk = 0;
  const projectsWithMetrics: Array<Project & { progress: number; health: ProjectHealthMetrics }> = [];
  
  activeProjects.forEach(project => {
    const progress = calculateProjectProgress(project.id, allTasks, project);
    const health = calculateProjectHealth(progress, project);
    
    totalProgress += progress.progressPercentage;
    if (health.riskLevel === 'high') {
      projectsAtRisk++;
    }
    
    projectsWithMetrics.push({
      ...project,
      progress: progress.progressPercentage,
      health,
    });
  });
  
  const averageProgress = activeProjects.length > 0 ? totalProgress / activeProjects.length : 0;
  const completedProjects = activeProjects.filter(p => p.progress === 100).length;
  const completionRate = activeProjects.length > 0 ? (completedProjects / activeProjects.length) * 100 : 0;
  
  // Top performing projects (high progress, low risk)
  const topPerformingProjects = projectsWithMetrics
    .filter(p => p.progress > 70 && p.health.riskLevel === 'low')
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);
  
  // Projects needing attention (low progress or high risk)
  const projectsNeedingAttention = projectsWithMetrics
    .filter(p => p.progress < 50 || p.health.riskLevel === 'high')
    .sort((a, b) => {
      // Sort by risk level first, then by progress
      const riskWeight = { high: 3, medium: 2, low: 1 };
      return riskWeight[b.health.riskLevel] - riskWeight[a.health.riskLevel] || a.progress - b.progress;
    })
    .slice(0, 5);
  
  return {
    totalProjects: activeProjects.length,
    averageProgress: Math.round(averageProgress),
    projectsAtRisk,
    completionRate: Math.round(completionRate),
    topPerformingProjects,
    projectsNeedingAttention,
  };
}