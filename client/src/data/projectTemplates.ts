import { ProjectTemplate, ProjectCategory } from '@/types';

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'web-dev-template',
    name: 'Web Development Project',
    description: 'Complete workflow for developing a web application from planning to deployment',
    category: ProjectCategory.SIDE_PROJECT,
    estimatedDuration: '8-12 weeks',
    tags: ['web-development', 'frontend', 'backend', 'deployment'],
    tasks: [
      {
        title: 'Project Planning & Requirements',
        description: 'Define project scope, requirements, and technical specifications',
        estimatedHours: 8,
      },
      {
        title: 'UI/UX Design & Wireframes',
        description: 'Create wireframes, mockups, and design system',
        estimatedHours: 16,
        dependencies: [0],
      },
      {
        title: 'Database Design',
        description: 'Design database schema and relationships',
        estimatedHours: 6,
        dependencies: [0],
      },
      {
        title: 'Backend API Development',
        description: 'Develop REST API endpoints and business logic',
        estimatedHours: 32,
        dependencies: [2],
      },
      {
        title: 'Frontend Development',
        description: 'Build user interface and integrate with API',
        estimatedHours: 40,
        dependencies: [1, 3],
      },
      {
        title: 'Testing & Quality Assurance',
        description: 'Write tests and perform thorough testing',
        estimatedHours: 16,
        dependencies: [4],
      },
      {
        title: 'Deployment & DevOps',
        description: 'Set up CI/CD pipeline and deploy to production',
        estimatedHours: 12,
        dependencies: [5],
      },
      {
        title: 'Documentation',
        description: 'Write user documentation and technical docs',
        estimatedHours: 8,
        dependencies: [6],
      },
    ],
  },
  {
    id: 'mobile-app-template',
    name: 'Mobile App Development',
    description: 'End-to-end mobile application development workflow',
    category: ProjectCategory.SIDE_PROJECT,
    estimatedDuration: '10-16 weeks',
    tags: ['mobile', 'ios', 'android', 'react-native'],
    tasks: [
      {
        title: 'Market Research & Planning',
        description: 'Research target audience and competitive analysis',
        estimatedHours: 12,
      },
      {
        title: 'App Design & Prototyping',
        description: 'Create app mockups and interactive prototypes',
        estimatedHours: 20,
        dependencies: [0],
      },
      {
        title: 'Technical Architecture',
        description: 'Define app architecture and technology stack',
        estimatedHours: 8,
        dependencies: [0],
      },
      {
        title: 'Backend Services Setup',
        description: 'Set up backend services and APIs',
        estimatedHours: 24,
        dependencies: [2],
      },
      {
        title: 'Core App Development',
        description: 'Develop main app features and functionality',
        estimatedHours: 60,
        dependencies: [1, 3],
      },
      {
        title: 'App Testing & Debugging',
        description: 'Test app on multiple devices and fix bugs',
        estimatedHours: 20,
        dependencies: [4],
      },
      {
        title: 'App Store Preparation',
        description: 'Prepare app store listings and submission materials',
        estimatedHours: 8,
        dependencies: [5],
      },
      {
        title: 'App Store Submission',
        description: 'Submit app to App Store and Google Play',
        estimatedHours: 4,
        dependencies: [6],
      },
    ],
  },
  {
    id: 'marketing-campaign-template',
    name: 'Marketing Campaign',
    description: 'Comprehensive marketing campaign planning and execution',
    category: ProjectCategory.WORK,
    estimatedDuration: '6-8 weeks',
    tags: ['marketing', 'campaign', 'social-media', 'content'],
    tasks: [
      {
        title: 'Campaign Strategy & Goals',
        description: 'Define campaign objectives, target audience, and KPIs',
        estimatedHours: 6,
      },
      {
        title: 'Market Research & Analysis',
        description: 'Research competitors and market trends',
        estimatedHours: 8,
        dependencies: [0],
      },
      {
        title: 'Content Strategy Planning',
        description: 'Plan content themes, calendar, and messaging',
        estimatedHours: 10,
        dependencies: [1],
      },
      {
        title: 'Creative Asset Development',
        description: 'Create graphics, videos, and marketing materials',
        estimatedHours: 24,
        dependencies: [2],
      },
      {
        title: 'Campaign Launch Preparation',
        description: 'Set up tracking, scheduling, and launch checklist',
        estimatedHours: 8,
        dependencies: [3],
      },
      {
        title: 'Campaign Execution',
        description: 'Launch and actively manage the campaign',
        estimatedHours: 16,
        dependencies: [4],
      },
      {
        title: 'Performance Monitoring',
        description: 'Track metrics and adjust campaign as needed',
        estimatedHours: 12,
        dependencies: [5],
      },
      {
        title: 'Campaign Analysis & Report',
        description: 'Analyze results and create final report',
        estimatedHours: 6,
        dependencies: [6],
      },
    ],
  },
  {
    id: 'learning-project-template',
    name: 'Learning & Skill Development',
    description: 'Structured approach to learning new skills or technologies',
    category: ProjectCategory.LEARNING,
    estimatedDuration: '4-8 weeks',
    tags: ['learning', 'skill-development', 'education', 'practice'],
    tasks: [
      {
        title: 'Learning Goals & Assessment',
        description: 'Define what you want to learn and current skill level',
        estimatedHours: 2,
      },
      {
        title: 'Learning Resource Research',
        description: 'Find courses, books, tutorials, and other resources',
        estimatedHours: 4,
        dependencies: [0],
      },
      {
        title: 'Create Learning Schedule',
        description: 'Plan daily/weekly learning schedule and milestones',
        estimatedHours: 2,
        dependencies: [1],
      },
      {
        title: 'Foundational Learning',
        description: 'Complete basic concepts and fundamentals',
        estimatedHours: 20,
        dependencies: [2],
      },
      {
        title: 'Hands-on Practice Projects',
        description: 'Build practical projects to apply knowledge',
        estimatedHours: 30,
        dependencies: [3],
      },
      {
        title: 'Advanced Topics & Specialization',
        description: 'Dive deeper into specific areas of interest',
        estimatedHours: 20,
        dependencies: [4],
      },
      {
        title: 'Portfolio Project',
        description: 'Create a comprehensive project showcasing skills',
        estimatedHours: 25,
        dependencies: [5],
      },
      {
        title: 'Knowledge Assessment & Next Steps',
        description: 'Evaluate progress and plan continued learning',
        estimatedHours: 3,
        dependencies: [6],
      },
    ],
  },
  {
    id: 'event-planning-template',
    name: 'Event Planning',
    description: 'Complete event planning and execution workflow',
    category: ProjectCategory.PERSONAL,
    estimatedDuration: '6-12 weeks',
    tags: ['event-planning', 'organization', 'coordination'],
    tasks: [
      {
        title: 'Event Concept & Planning',
        description: 'Define event type, theme, and initial planning',
        estimatedHours: 4,
      },
      {
        title: 'Budget Planning & Approval',
        description: 'Create detailed budget and get necessary approvals',
        estimatedHours: 3,
        dependencies: [0],
      },
      {
        title: 'Venue Research & Booking',
        description: 'Find and book appropriate venue',
        estimatedHours: 8,
        dependencies: [1],
      },
      {
        title: 'Vendor Research & Contracts',
        description: 'Find and contract catering, entertainment, etc.',
        estimatedHours: 12,
        dependencies: [1],
      },
      {
        title: 'Marketing & Invitations',
        description: 'Create promotional materials and send invitations',
        estimatedHours: 6,
        dependencies: [2],
      },
      {
        title: 'Event Logistics Planning',
        description: 'Plan timeline, staffing, and day-of logistics',
        estimatedHours: 8,
        dependencies: [3, 4],
      },
      {
        title: 'Final Preparations',
        description: 'Confirm details, prepare materials, final checks',
        estimatedHours: 6,
        dependencies: [5],
      },
      {
        title: 'Event Execution',
        description: 'Manage and execute the event',
        estimatedHours: 8,
        dependencies: [6],
      },
      {
        title: 'Post-Event Follow-up',
        description: 'Thank participants, gather feedback, finalize payments',
        estimatedHours: 4,
        dependencies: [7],
      },
    ],
  },
  {
    id: 'open-source-contribution-template',
    name: 'Open Source Contribution',
    description: 'Structured approach to contributing to open source projects',
    category: ProjectCategory.OPEN_SOURCE,
    estimatedDuration: '2-4 weeks',
    tags: ['open-source', 'contribution', 'community', 'development'],
    tasks: [
      {
        title: 'Project Research & Selection',
        description: 'Find suitable open source projects to contribute to',
        estimatedHours: 4,
      },
      {
        title: 'Codebase Analysis',
        description: 'Study project structure, conventions, and guidelines',
        estimatedHours: 8,
        dependencies: [0],
      },
      {
        title: 'Issue Selection & Planning',
        description: 'Choose issues to work on and plan approach',
        estimatedHours: 2,
        dependencies: [1],
      },
      {
        title: 'Development Environment Setup',
        description: 'Set up local development environment',
        estimatedHours: 3,
        dependencies: [1],
      },
      {
        title: 'Feature/Fix Implementation',
        description: 'Implement the feature or bug fix',
        estimatedHours: 12,
        dependencies: [2, 3],
      },
      {
        title: 'Testing & Documentation',
        description: 'Test changes and update documentation',
        estimatedHours: 4,
        dependencies: [4],
      },
      {
        title: 'Pull Request Submission',
        description: 'Submit pull request with proper description',
        estimatedHours: 2,
        dependencies: [5],
      },
      {
        title: 'Code Review & Iteration',
        description: 'Respond to feedback and make necessary changes',
        estimatedHours: 6,
        dependencies: [6],
      },
    ],
  }
];

export const getTemplateById = (templateId: string): ProjectTemplate | undefined => {
  return projectTemplates.find(template => template.id === templateId);
};

export const getTemplatesByCategory = (category: ProjectCategory): ProjectTemplate[] => {
  return projectTemplates.filter(template => template.category === category);
};

export const getAllTemplateCategories = (): ProjectCategory[] => {
  const categories = new Set(projectTemplates.map(template => template.category));
  return Array.from(categories);
};