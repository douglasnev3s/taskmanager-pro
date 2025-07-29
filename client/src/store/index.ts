import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { persistReducer } from 'redux-persist';
import storage from '@/lib/storage';

import tasksReducer from './slices/tasksSlice';
import uiReducer from './slices/uiSlice';
import toastMiddleware from './middleware/toastMiddleware';

// Persist configuration - Only persist UI preferences, not data (data comes from API)
const persistConfig = {
  key: 'taskmanager-pro',
  storage,
  whitelist: ['ui'], // Only persist UI preferences, tasks come from API
};

// Root reducer
const rootReducer = combineReducers({
  tasks: tasksReducer,
  ui: uiReducer,
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