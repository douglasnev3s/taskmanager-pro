# Redux Store Documentation

## Overview
This directory contains the complete Redux Toolkit store implementation for TaskManager Pro, featuring:

- **Type-safe Redux Toolkit setup** with TypeScript integration
- **Comprehensive task management** with CRUD operations
- **UI state management** for modals, notifications, and loading states
- **Persistent state** using redux-persist
- **Optimized selectors** with memoization
- **Async thunks** for API communication

## Structure

```
store/
├── index.ts                 # Store configuration and typed hooks
├── slices/
│   ├── tasksSlice.ts       # Task management slice
│   └── uiSlice.ts          # UI state slice
├── selectors/
│   ├── index.ts            # Selector exports
│   ├── tasksSelectors.ts   # Task-related selectors
│   └── uiSelectors.ts      # UI state selectors
├── providers/
│   └── StoreProvider.tsx   # Redux provider wrapper
├── tests/
│   └── storeTest.ts        # Store functionality tests
└── README.md               # This file
```

## Usage

### Provider Setup
```tsx
import { StoreProvider } from '@/store/providers/StoreProvider';

function App() {
  return (
    <StoreProvider>
      {/* Your app components */}
    </StoreProvider>
  );
}
```

### Using Typed Hooks
```tsx
import { useAppDispatch, useAppSelector } from '@/store';

function TaskComponent() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectFilteredTasks);
  const loading = useAppSelector(selectTasksLoading);
  
  // Dispatch actions
  const handleCreateTask = () => {
    dispatch(createTask({ title: 'New Task', priority: TaskPriority.MEDIUM }));
  };
}
```

### Available Actions

#### Tasks Slice
- `fetchTasks()` - Fetch all tasks from API
- `createTask(data)` - Create new task
- `updateTask(data)` - Update existing task
- `deleteTask(id)` - Delete task
- `setFilter(filter)` - Set task filter
- `setSearchQuery(query)` - Set search query
- `toggleTaskComplete(id)` - Toggle task completion

#### UI Slice
- `setGlobalLoading(bool)` - Set global loading state
- `openCreateTaskModal(data?)` - Open create task modal
- `addNotification(notification)` - Add notification
- `toggleSidebar()` - Toggle sidebar visibility
- `setTheme(theme)` - Set application theme

### Key Selectors

#### Task Selectors
- `selectFilteredTasks` - Get filtered and searched tasks
- `selectTaskStats` - Get task statistics
- `selectTasksByPriority` - Get tasks grouped by priority
- `selectRecentTasks` - Get recently updated tasks

#### UI Selectors
- `selectGlobalLoading` - Get global loading state
- `selectCreateTaskModal` - Get create task modal state
- `selectNotifications` - Get all notifications
- `selectAnyModalOpen` - Check if any modal is open

## Testing

Run the store tests:
```tsx
import { testStoreFunction } from '@/store/tests/storeTest';

testStoreFunction(); // Run comprehensive store tests
```

## Persistence

The store automatically persists task data using redux-persist:
- **Persisted**: Tasks slice data
- **Not Persisted**: UI state (modals, notifications, loading states)
- **Storage**: localStorage (browser)