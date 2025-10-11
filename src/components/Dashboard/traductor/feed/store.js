import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../../store/reducers/auth';
import { feedApi } from './FeedApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [feedApi.reducerPath]: feedApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedApi.middleware),
});
