import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UIState, Notification, NotificationType } from '@/types';

// Initial state
const initialState: UIState = {
  loading: {
    global: false,
    tasks: false,
    createTask: false,
    updateTask: false,
    deleteTask: false,
  },
  modals: {
    createTask: { isOpen: false, type: null },
    editTask: { isOpen: false, type: null },
    deleteTask: { isOpen: false, type: null },
    taskDetails: { isOpen: false, type: null },
  },
  notifications: [],
  sidebarOpen: false,
  theme: 'system',
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading states
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setTasksLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.tasks = action.payload;
    },
    setCreateTaskLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.createTask = action.payload;
    },
    setUpdateTaskLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.updateTask = action.payload;
    },
    setDeleteTaskLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.deleteTask = action.payload;
    },

    // Modal states
    openCreateTaskModal: (state, action: PayloadAction<Record<string, any> | undefined>) => {
      state.modals.createTask = {
        isOpen: true,
        type: 'create',
        data: action.payload,
      };
    },
    closeCreateTaskModal: (state) => {
      state.modals.createTask = { isOpen: false, type: null };
    },
    openEditTaskModal: (state, action: PayloadAction<Record<string, any>>) => {
      state.modals.editTask = {
        isOpen: true,
        type: 'edit',
        data: action.payload,
      };
    },
    closeEditTaskModal: (state) => {
      state.modals.editTask = { isOpen: false, type: null };
    },
    openDeleteTaskModal: (state, action: PayloadAction<Record<string, any>>) => {
      state.modals.deleteTask = {
        isOpen: true,
        type: 'delete',
        data: action.payload,
      };
    },
    closeDeleteTaskModal: (state) => {
      state.modals.deleteTask = { isOpen: false, type: null };
    },
    openTaskDetailsModal: (state, action: PayloadAction<Record<string, any>>) => {
      state.modals.taskDetails = {
        isOpen: true,
        type: 'details',
        data: action.payload,
      };
    },
    closeTaskDetailsModal: (state) => {
      state.modals.taskDetails = { isOpen: false, type: null };
    },
    closeAllModals: (state) => {
      state.modals.createTask = { isOpen: false, type: null };
      state.modals.editTask = { isOpen: false, type: null };
      state.modals.deleteTask = { isOpen: false, type: null };
      state.modals.taskDetails = { isOpen: false, type: null };
    },

    // Notifications
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      state.notifications.unshift(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },

    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },

    // Reset UI state
    resetUI: (state) => {
      return { ...initialState, theme: state.theme };
    },
  },
});

// Helper action creators for common notification patterns
export const showSuccessNotification = (title: string, message?: string, duration?: number) =>
  uiSlice.actions.addNotification({
    type: NotificationType.SUCCESS,
    title,
    message,
    duration,
  });

export const showErrorNotification = (title: string, message?: string, duration?: number) =>
  uiSlice.actions.addNotification({
    type: NotificationType.ERROR,
    title,
    message,
    duration,
  });

export const showWarningNotification = (title: string, message?: string, duration?: number) =>
  uiSlice.actions.addNotification({
    type: NotificationType.WARNING,
    title,
    message,
    duration,
  });

export const showInfoNotification = (title: string, message?: string, duration?: number) =>
  uiSlice.actions.addNotification({
    type: NotificationType.INFO,
    title,
    message,
    duration,
  });

export const {
  setGlobalLoading,
  setTasksLoading,
  setCreateTaskLoading,
  setUpdateTaskLoading,
  setDeleteTaskLoading,
  openCreateTaskModal,
  closeCreateTaskModal,
  openEditTaskModal,
  closeEditTaskModal,
  openDeleteTaskModal,
  closeDeleteTaskModal,
  openTaskDetailsModal,
  closeTaskDetailsModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearAllNotifications,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;