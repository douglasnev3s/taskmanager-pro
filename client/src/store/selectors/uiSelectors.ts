import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../index';

// Base selector
const selectUIState = (state: RootState) => state.ui;

// Loading selectors
export const selectGlobalLoading = createSelector(
  selectUIState,
  (ui) => ui.loading.global
);

export const selectUITasksLoading = createSelector(
  selectUIState,
  (ui) => ui.loading.tasks
);

export const selectCreateTaskLoading = createSelector(
  selectUIState,
  (ui) => ui.loading.createTask
);

export const selectUpdateTaskLoading = createSelector(
  selectUIState,
  (ui) => ui.loading.updateTask
);

export const selectDeleteTaskLoading = createSelector(
  selectUIState,
  (ui) => ui.loading.deleteTask
);

export const selectAnyLoading = createSelector(
  selectUIState,
  (ui) => 
    ui.loading.global ||
    ui.loading.tasks ||
    ui.loading.createTask ||
    ui.loading.updateTask ||
    ui.loading.deleteTask
);

// Modal selectors
export const selectCreateTaskModal = createSelector(
  selectUIState,
  (ui) => ui.modals.createTask
);

export const selectEditTaskModal = createSelector(
  selectUIState,
  (ui) => ui.modals.editTask
);

export const selectDeleteTaskModal = createSelector(
  selectUIState,
  (ui) => ui.modals.deleteTask
);

export const selectTaskDetailsModal = createSelector(
  selectUIState,
  (ui) => ui.modals.taskDetails
);

export const selectAnyModalOpen = createSelector(
  selectUIState,
  (ui) => 
    ui.modals.createTask.isOpen ||
    ui.modals.editTask.isOpen ||
    ui.modals.deleteTask.isOpen ||
    ui.modals.taskDetails.isOpen
);

// Notification selectors
export const selectNotifications = createSelector(
  selectUIState,
  (ui) => ui.notifications
);

export const selectLatestNotification = createSelector(
  selectNotifications,
  (notifications) => notifications[0] || null
);

export const selectNotificationCount = createSelector(
  selectNotifications,
  (notifications) => notifications.length
);

// UI state selectors
export const selectSidebarOpen = createSelector(
  selectUIState,
  (ui) => ui.sidebarOpen
);

export const selectTheme = createSelector(
  selectUIState,
  (ui) => ui.theme
);

// Combined selectors
export const selectUIStatus = createSelector(
  selectUIState,
  (ui) => ({
    hasAnyLoading: ui.loading.global ||
      ui.loading.tasks ||
      ui.loading.createTask ||
      ui.loading.updateTask ||
      ui.loading.deleteTask,
    hasAnyModalOpen: ui.modals.createTask.isOpen ||
      ui.modals.editTask.isOpen ||
      ui.modals.deleteTask.isOpen ||
      ui.modals.taskDetails.isOpen,
    hasNotifications: ui.notifications.length > 0,
    sidebarOpen: ui.sidebarOpen,
    theme: ui.theme,
  })
);