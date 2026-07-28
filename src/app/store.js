import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '../api/authApi'
import { testApi } from '../api/testApi'
import { attemptApi } from '../api/attemptApi'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [testApi.reducerPath]: testApi.reducer,
    [attemptApi.reducerPath]: attemptApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, testApi.middleware, attemptApi.middleware),
})
