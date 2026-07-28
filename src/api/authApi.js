import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from './baseUrl'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    loginStudent: builder.mutation({
      query: (credentials) => ({
        url: 'students/login',
        method: 'POST',
        body: credentials, // { roll, password }
      }),
    }),

    getAttendance: builder.query({
      query: ({ studentId, ...params }) => ({
        url: `students/${studentId}/attendance`,
        params, // turns { month: 4 } into ?month=4
      }),
      // merges new pages of data into the existing list for infinite scroll
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) return newItems // reset list if it's the first page
        currentCache.records.push(...newItems.records)
        currentCache.pagination = newItems.pagination
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
    }),

    getProfile: builder.query({
      query: (studentId) => `students/app/${studentId}`,
    }),

    viewResults: builder.mutation({
      query: (credentials) => ({
        url: 'results/view',
        method: 'POST',
        body: credentials, // { rollNumber, password }
      }),
    }),
  }),
})

export const {
  useLoginStudentMutation,
  useGetAttendanceQuery,
  useGetProfileQuery,
  useViewResultsMutation,
} = authApi
