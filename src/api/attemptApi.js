import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from './baseUrl'

// Ported 1:1 from src/Api/test.js
export const attemptApi = createApi({
  reducerPath: 'attemptApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Report', 'Attempts', 'Review', 'Pdfs'],
  endpoints: (builder) => ({
    getSectionsByClass: builder.query({
      query: (classId) => ({
        url: 'teacher/subjects',
        method: 'GET',
        params: { classId },
      }),
    }),

    getPublishedTests: builder.mutation({
      query: (body) => ({
        url: 'teacher/tests/published/by-class-section',
        method: 'POST',
        body,
      }),
    }),

    getTestById: builder.query({
      query: (testId) => ({
        url: `teacher/tests/${testId}`,
        method: 'GET',
      }),
    }),

    submitTest: builder.mutation({
      query: ({ testId, submissionData }) => ({
        url: `teacher/attempt/${testId}`,
        method: 'POST',
        body: submissionData,
      }),
      invalidatesTags: ['Report'],
    }),

    getStudentReport: builder.query({
      query: (studentId) => ({
        url: `teacher/student-report/${studentId}`,
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),

    getAttemptedTests: builder.query({
      query: (studentId) => ({
        url: `teacher/attempts/student/${studentId}`,
        method: 'GET',
      }),
      providesTags: ['Attempts'],
    }),

    reviewTest: builder.query({
      query: ({ testId, studentId }) => ({
        url: `teacher/attempts/review/${testId}/${studentId}`,
        method: 'GET',
      }),
      providesTags: ['Review'],
    }),

    getPdfs: builder.query({
      query: ({ classId, sectionId, subjectId, page = 1, limit = 10000 }) => ({
        url: `teacher/pdfs?classId=${classId}&sectionId=${sectionId}&subjectId=${subjectId}&page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Pdfs'],
    }),
  }),
})

export const {
  useGetSectionsByClassQuery,
  useGetPublishedTestsMutation,
  useGetTestByIdQuery,
  useSubmitTestMutation,
  useGetStudentReportQuery,
  useGetAttemptedTestsQuery,
  useReviewTestQuery,
  useGetPdfsQuery,
} = attemptApi
