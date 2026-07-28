import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from './baseUrl'

// Student-facing subset of the original testApi.js. Teacher CRUD endpoints
// (createTest, publishTest, MCQ management, teacher test listings, subject
// CRUD) were intentionally removed — the web app has no teacher portal.
export const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Classes', 'Subjects'],
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: () => 'classes',
      providesTags: ['Classes'],
    }),
    getSections: builder.query({
      query: (classId) => `classes/${classId}/sections`,
    }),
    getSubjects: builder.query({
      query: (classId) => `teacher/subjects?classId=${classId}`,
      providesTags: ['Subjects'],
    }),
  }),
})

export const { useGetClassesQuery, useGetSectionsQuery, useGetSubjectsQuery } = testApi
