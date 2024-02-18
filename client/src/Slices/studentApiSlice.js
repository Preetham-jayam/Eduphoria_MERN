import { STUDENT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const getJWTToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};
export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_URL}/updateprofile/${data.studentId}`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Student"],
    }),

    enrollCourse: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_URL}/${data.userId}/enrollcourse/${data.courseId}`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Student"],
    }),

    addReview: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_URL}/addreview/${data.courseId}`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Student"],
    }),
    updateCompletedLessons: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_URL}/updateCompletedLessons/${data.studentId}`, 
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
    }),

    updateQuizResults: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_URL}/updateQuizResults/${data.studentId}`,
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Student"],
    }),

  }),
});

export const {
  useUpdateProfileMutation,
  useAddReviewMutation,
  useEnrollCourseMutation,
  useUpdateCompletedLessonsMutation,
  useUpdateQuizResultsMutation
}=studentApiSlice;
