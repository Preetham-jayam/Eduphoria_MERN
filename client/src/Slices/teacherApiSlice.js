import { TEACHER_URL } from "../constants";
import { apiSlice } from "./apiSlice";


const getJWTToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};

export const teacherApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCourse: builder.mutation({
      query: (data) => ({
        url: `${TEACHER_URL}/addcourse`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Course"],
    }),
    updateCourse: builder.mutation({
      query: (data) => ({
        url: `${TEACHER_URL}/update/${data.courseId}`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `${TEACHER_URL}/delete/${courseId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Course"],
    }),
    addQuizToCourse: builder.mutation({
      query: ({ courseId, title, questions }) => ({
        url: `${TEACHER_URL}/addquiz/${courseId}`, 
        method: "POST",
        body: { title, questions },
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Course"],
    }),

    updateTeacherProfile: builder.mutation({
      query: (data) => ({
        url: `${TEACHER_URL}/updateprofile/${data.teacherId}`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Teacher"],
    }),
    addChapter: builder.mutation({
      query: ({ courseId, newChapter }) => ({
        url: `${TEACHER_URL}/addchapter/${courseId}`,
        method: 'POST',
        body: newChapter,
        headers: {
          Authorization:`Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ['Teacher'],
    }),
    addLesson: builder.mutation({
      query: ({ chapterId, lesson }) => ({
        url: `${TEACHER_URL}/addlesson/${chapterId}`,
        method: 'POST',
        body: lesson,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ['Course'],
    }),
  }),
});

export const {
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAddQuizToCourseMutation, 
  useUpdateTeacherProfileMutation,
  useAddChapterMutation,
  useAddLessonMutation

} = teacherApiSlice;
