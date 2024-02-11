import { COURSES_URL,TEACHER_URL } from "../constants";

import { apiSlice } from "./apiSlice";

const userInfo=JSON.parse(localStorage.getItem('userInfo'));
const JWT_TOKEN=userInfo ? userInfo.token:null;

export const coursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourseDetails: builder.query({
      query: (courseId) => ({
        url: `${COURSES_URL}/${courseId}`,
      }),
      providesTags: ["Course"],
      keepUnusedDataFor: 5,
    }),
    getCourses: builder.query({
      query: () => ({
        url: COURSES_URL,
      }),
      providesTags: ["Course"],
      keepUnusedDataFor: 5
    }),
    getCourseReviews : builder.query({
      query:(id)=>({
        url:`${COURSES_URL}/reviews/${id}`,
      }),
      providesTags:["Course"],
      keepUnusedDataFor:5,
    }),
    updateCourse: builder.mutation({
      query: ({ courseId, course }) => ({
        url: `${TEACHER_URL}/${courseId}`,
        method: 'PUT',
        body: course,
      }),
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
      invalidatesTags: ['Course'],
    }),
    deleteLesson: builder.mutation({
      query: ({ lessonId }) => ({
        url: `${TEACHER_URL}/deletelesson/${lessonId}`, 
        method: 'DELETE',
      }),
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
      invalidatesTags: ['Course'],
    }),
    addChapter: builder.mutation({
      query: ({ courseId, chapter }) => ({
        url: `${TEACHER_URL}/addchapter/${courseId}`,
        method: 'POST',
        body: chapter,
      }),
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
      invalidatesTags: ['Course','Chapter'],
    }),
    addLesson: builder.mutation({
      query: ({ chapterId, lesson }) => ({
        url: `${TEACHER_URL}/addlesson/${chapterId}`,
        method: 'POST',
        body: lesson,
      }),
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
      invalidatesTags: ['Course'],
    }),
    updateChapter: builder.mutation({
      query: ({ chapterId, chapter }) => ({
        url: `${TEACHER_URL}/updatechapter/${chapterId}`,
        method: 'PUT',
        body: chapter,
      }),
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
      invalidatesTags: ['Course'],
    }),
    updateLesson: builder.mutation({
      query: ({ lessonId, lesson }) => ({
        url: `${TEACHER_URL}/updatelesson/${lessonId}`,
        method: 'PUT',
        body: lesson,
      }),
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
      invalidatesTags: ['Course'],
    }),
    getQuizByCourseId: builder.query({
      query: (courseId) => ({
        url: `${COURSES_URL}/${courseId}/quiz`,
      }),
      providesTags: ["Quiz"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetCourseDetailsQuery,
  useGetCoursesQuery,
  useGetCourseReviewsQuery,
  useUpdateCourseMutation,
  useDeleteLessonMutation,
  useAddChapterMutation,
  useAddLessonMutation,
  useUpdateChapterMutation,
  useUpdateLessonMutation,
  useGetQuizByCourseIdQuery
} = coursesApiSlice;
