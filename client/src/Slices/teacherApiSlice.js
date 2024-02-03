import { TEACHER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const userInfo=JSON.parse(localStorage.getItem('userInfo'));
const JWT_TOKEN=userInfo ? userInfo.token:null;



export const teacherApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCourse: builder.mutation({
      query: (data) => ({
        url: `${TEACHER_URL}/addcourse`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
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
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `${TEACHER_URL}/delete/${courseId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = teacherApiSlice;
