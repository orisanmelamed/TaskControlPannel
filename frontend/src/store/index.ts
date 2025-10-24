import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice.js';
import tasksReducer from './slices/tasksSlice.js';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;