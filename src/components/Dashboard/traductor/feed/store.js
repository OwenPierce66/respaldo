// src/.../store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../../../../store/reducers/auth';
import { feedApi } from './FeedApi';
import { commentApi } from '../commentApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [feedApi.reducerPath]: feedApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      feedApi.middleware,
      commentApi.middleware
    ),
});

// Opcional pero recomendado para refetchOnFocus/refetchOnReconnect:
setupListeners(store.dispatch);
