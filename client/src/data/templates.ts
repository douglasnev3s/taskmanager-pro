import { TaskTemplate, TemplateCategory, TaskPriority } from '@/types';

export const BUILT_IN_TEMPLATES: TaskTemplate[] = [
  // Job Application Template
  {
    id: 'job-application',
    name: 'Job Application Process',
    description: 'Complete workflow for applying to a job position, from research to follow-up',
    category: TemplateCategory.CAREER,
    tags: ['job', 'application', 'career', 'professional'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedTotalTime: '1-2 weeks',
    difficulty: 'beginner',
    usageCount: 0,
    tasks: [
      {
        title: 'Research Company & Role',
        description: 'Thoroughly research the company culture, values, recent news, and the specific role requirements',
        priority: TaskPriority.HIGH,
        estimatedDuration: '2-3 hours',
        tags: ['research', 'company', 'preparation'],
        defaultDueDate: { days: 1, relative: 'start' }
      },
      {
        title: 'Update Resume for Position',
        description: 'Tailor your resume to highlight relevant skills and experiences for this specific role',
        priority: TaskPriority.HIGH,
        estimatedDuration: '2-4 hours',
        tags: ['resume', 'customization'],
        dependsOn: [0],
        defaultDueDate: { days: 2, relative: 'start' }
      },
      {
        title: 'Write Compelling Cover Letter',
        description: 'Craft a personalized cover letter that demonstrates your interest and qualifications',
        priority: TaskPriority.HIGH,
        estimatedDuration: '1-2 hours',
        tags: ['cover-letter', 'writing'],
        dependsOn: [0, 1],
        defaultDueDate: { days: 3, relative: 'start' }
      },
      {
        title: 'Submit Application',
        description: 'Submit your application through the appropriate channel with all required documents',
        priority: TaskPriority.HIGH,
        estimatedDuration: '30 minutes',
        tags: ['submission', 'application'],
        dependsOn: [1, 2],
        defaultDueDate: { days: 4, relative: 'start' }
      },
      {
        title: 'Follow-up Reminder',
        description: 'Schedule and send a polite follow-up message if you haven\'t heard back',
        priority: TaskPriority.MEDIUM,
        estimatedDuration: '15 minutes',
        tags: ['follow-up', 'communication'],
        dependsOn: [3],
        defaultDueDate: { days: 10, relative: 'start' }
      }
    ]
  },

  // Interview Preparation Template
  {
    id: 'interview-preparation',
    name: 'Interview Preparation',
    description: 'Comprehensive preparation strategy for job interviews',
    category: TemplateCategory.CAREER,
    tags: ['interview', 'preparation', 'career', 'practice'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedTotalTime: '1 week',
    difficulty: 'intermediate',
    usageCount: 0,
    tasks: [
      {
        title: 'Review Job Description Thoroughly',
        description: 'Analyze the job requirements, responsibilities, and preferred qualifications in detail',
        priority: TaskPriority.HIGH,
        estimatedDuration: '1 hour',
        tags: ['analysis', 'requirements'],
        defaultDueDate: { days: 1, relative: 'start' }
      },
      {
        title: 'Research Company Culture & Values',
        description: 'Study company website, social media, news, and employee reviews to understand culture',
        priority: TaskPriority.HIGH,
        estimatedDuration: '2 hours',
        tags: ['research', 'culture', 'company'],
        defaultDueDate: { days: 1, relative: 'start' }
      },
      {
        title: 'Prepare STAR Method Examples',
        description: 'Develop 5-7 Situation, Task, Action, Result examples from your experience',
        priority: TaskPriority.HIGH,
        estimatedDuration: '3-4 hours',
        tags: ['STAR', 'examples', 'stories'],
        dependsOn: [0],
        defaultDueDate: { days: 3, relative: 'start' }
      },
      {
        title: 'Practice Technical Questions',
        description: 'Review and practice relevant technical questions and coding challenges',
        priority: TaskPriority.HIGH,
        estimatedDuration: '4-6 hours',
        tags: ['technical', 'practice', 'coding'],
        dependsOn: [0],
        defaultDueDate: { days: 4, relative: 'start' }
      },
      {
        title: 'Prepare Questions to Ask Interviewer',
        description: 'Prepare thoughtful questions about the role, team, company, and growth opportunities',
        priority: TaskPriority.MEDIUM,
        estimatedDuration: '1 hour',
        tags: ['questions', 'engagement'],
        dependsOn: [1],
        defaultDueDate: { days: 2, relative: 'start' }
      }
    ]
  },

  // Skill Development Template
  {
    id: 'skill-development',
    name: 'Skill Development Plan',
    description: 'Structured approach to learning and developing new professional skills',
    category: TemplateCategory.LEARNING,
    tags: ['learning', 'skills', 'development', 'growth'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedTotalTime: '2-3 months',
    difficulty: 'intermediate',
    usageCount: 0,
    tasks: [
      {
        title: 'Identify Learning Goals & Objectives',
        description: 'Define specific, measurable learning goals and desired skill proficiency levels',
        priority: TaskPriority.HIGH,
        estimatedDuration: '2 hours',
        tags: ['goals', 'planning', 'objectives'],
        defaultDueDate: { days: 1, relative: 'start' }
      },
      {
        title: 'Find Quality Learning Resources',
        description: 'Research and curate books, courses, tutorials, and other learning materials',
        priority: TaskPriority.HIGH,
        estimatedDuration: '3-4 hours',
        tags: ['resources', 'research', 'materials'],
        dependsOn: [0],
        defaultDueDate: { days: 3, relative: 'start' }
      },
      {
        title: 'Create Practice Projects',
        description: 'Design hands-on projects to apply and reinforce the new skills',
        priority: TaskPriority.HIGH,
        estimatedDuration: '4-6 hours',
        tags: ['practice', 'projects', 'application'],
        dependsOn: [1],
        defaultDueDate: { days: 14, relative: 'start' }
      },
      {
        title: 'Track Progress & Milestones',
        description: 'Set up a system to monitor learning progress and celebrate achievements',
        priority: TaskPriority.MEDIUM,
        estimatedDuration: '1 hour',
        tags: ['tracking', 'progress', 'milestones'],
        dependsOn: [0],
        defaultDueDate: { days: 7, relative: 'start' }
      },
      {
        title: 'Update Portfolio & Resume',
        description: 'Document new skills and showcase projects in your professional portfolio',
        priority: TaskPriority.MEDIUM,
        estimatedDuration: '2-3 hours',
        tags: ['portfolio', 'documentation', 'showcase'],
        dependsOn: [2],
        defaultDueDate: { days: 60, relative: 'start' }
      }
    ]
  },

  // Portfolio Project Template
  {
    id: 'portfolio-project',
    name: 'Portfolio Project Development',
    description: 'End-to-end process for creating a professional portfolio project',
    category: TemplateCategory.PROJECT,
    tags: ['portfolio', 'project', 'development', 'showcase'],
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedTotalTime: '4-6 weeks',
    difficulty: 'advanced',
    usageCount: 0,
    tasks: [
      {
        title: 'Project Planning & Requirements',
        description: 'Define project scope, requirements, technologies, and timeline',
        priority: TaskPriority.HIGH,
        estimatedDuration: '4-6 hours',
        tags: ['planning', 'requirements', 'scope'],
        defaultDueDate: { days: 2, relative: 'start' }
      },
      {
        title: 'Development Phase Execution',
        description: 'Implement the project following best practices and clean code principles',
        priority: TaskPriority.HIGH,
        estimatedDuration: '40-60 hours',
        tags: ['development', 'coding', 'implementation'],
        dependsOn: [0],
        defaultDueDate: { days: 21, relative: 'start' }
      },
      {
        title: 'Create Project Documentation',
        description: 'Write comprehensive README, API docs, and technical documentation',
        priority: TaskPriority.HIGH,
        estimatedDuration: '4-6 hours',
        tags: ['documentation', 'README', 'technical'],
        dependsOn: [1],
        defaultDueDate: { days: 25, relative: 'start' }
      },
      {
        title: 'Deploy & Test Application',
        description: 'Deploy to production environment and perform thorough testing',
        priority: TaskPriority.HIGH,
        estimatedDuration: '3-4 hours',
        tags: ['deployment', 'testing', 'production'],
        dependsOn: [1],
        defaultDueDate: { days: 28, relative: 'start' }
      },
      {
        title: 'Prepare Project Showcase',
        description: 'Create presentation materials, demos, and portfolio entry',
        priority: TaskPriority.MEDIUM,
        estimatedDuration: '3-4 hours',
        tags: ['showcase', 'presentation', 'demo'],
        dependsOn: [2, 3],
        defaultDueDate: { days: 30, relative: 'start' }
      }
    ]
  }
];

// Template categories with metadata
export const TEMPLATE_CATEGORIES = [
  {
    id: TemplateCategory.CAREER,
    name: 'Career Development',
    description: 'Templates for job searching, interviews, and career growth',
    color: '#3B82F6', // blue
    icon: '💼'
  },
  {
    id: TemplateCategory.LEARNING,
    name: 'Learning & Skills',
    description: 'Templates for skill development and educational goals',
    color: '#10B981', // green
    icon: '📚'
  },
  {
    id: TemplateCategory.PROJECT,
    name: 'Project Management',
    description: 'Templates for managing and executing projects',
    color: '#8B5CF6', // purple
    icon: '🚀'
  },
  {
    id: TemplateCategory.PERSONAL,
    name: 'Personal Goals',
    description: 'Templates for personal development and life goals',
    color: '#F59E0B', // orange
    icon: '🎯'
  },
  {
    id: TemplateCategory.BUSINESS,
    name: 'Business & Entrepreneurship',
    description: 'Templates for business planning and entrepreneurial activities',
    color: '#EF4444', // red
    icon: '💡'
  },
  {
    id: TemplateCategory.CUSTOM,
    name: 'Custom Templates',
    description: 'User-created templates',
    color: '#6B7280', // gray
    icon: '⚙️'
  }
];

// Helper function to get category color
export const getCategoryColor = (category: TemplateCategory): string => {
  const categoryData = TEMPLATE_CATEGORIES.find(cat => cat.id === category);
  return categoryData?.color || '#6B7280';
};

// Helper function to get category icon
export const getCategoryIcon = (category: TemplateCategory): string => {
  const categoryData = TEMPLATE_CATEGORIES.find(cat => cat.id === category);
  return categoryData?.icon || '📋';
};

// Helper function to calculate estimated duration
export const calculateTemplateDuration = (tasks: any[]): string => {
  const totalHours = tasks.reduce((total, task) => {
    if (!task.estimatedDuration) return total;
    
    const duration = task.estimatedDuration.toLowerCase();
    if (duration.includes('hour')) {
      const hours = duration.match(/(\d+)-?(\d+)?/);
      return total + (hours ? parseInt(hours[1]) : 1);
    } else if (duration.includes('day')) {
      const days = duration.match(/(\d+)-?(\d+)?/);
      return total + (days ? parseInt(days[1]) * 8 : 8); // 8 hours per day
    } else if (duration.includes('week')) {
      const weeks = duration.match(/(\d+)-?(\d+)?/);
      return total + (weeks ? parseInt(weeks[1]) * 40 : 40); // 40 hours per week
    }
    return total;
  }, 0);

  if (totalHours < 8) {
    return `${totalHours} hours`;
  } else if (totalHours < 40) {
    const days = Math.ceil(totalHours / 8);
    return `${days} day${days > 1 ? 's' : ''}`;
  } else {
    const weeks = Math.ceil(totalHours / 40);
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  }
};