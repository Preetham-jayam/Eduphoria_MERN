import { STUDENT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const JWT_TOKEN = userInfo ? userInfo.token : null;

export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${STUDENT_URL}/updateprofile/${data.studentId}`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
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
          Authorization: `Bearer ${JWT_TOKEN}`,
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
          Authorization: `Bearer ${JWT_TOKEN}`,
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
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }),
    }),

  }),
});

export const {
  useUpdateProfileMutation,
  useAddReviewMutation,
  useEnrollCourseMutation,
  useUpdateCompletedLessonsMutation
}=studentApiSlice;
