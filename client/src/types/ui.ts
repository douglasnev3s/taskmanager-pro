export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

export interface Modal {
  isOpen: boolean;
  type: string | null;
  data?: Record<string, any>;
}

export interface UIState {
  loading: {
    global: boolean;
    tasks: boolean;
    createTask: boolean;
    updateTask: boolean;
    deleteTask: boolean;
  };
  modals: {
    createTask: Modal;
    editTask: Modal;
    deleteTask: Modal;
    taskDetails: Modal;
  };
  notifications: Notification[];
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
}