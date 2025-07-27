import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { persistReducer } from 'redux-persist';
import storage from '@/lib/storage';

import tasksReducer from './slices/tasksSlice';
import uiReducer from './slices/uiSlice';
import templatesReducer from './slices/templatesSlice';
import toastMiddleware from './middleware/toastMiddleware';

// Persist configuration
const persistConfig = {
  key: 'taskmanager-pro',
  storage,
  whitelist: ['tasks', 'templates'], // Persist tasks and templates, not UI state
};

// Root reducer
const rootReducer = combineReducers({
  tasks: tasksReducer,
  ui: uiReducer,
  templates: templatesReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/PURGE',
          'persist/FLUSH',
          'persist/PAUSE',
        ],
      },
    }).concat(toastMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;