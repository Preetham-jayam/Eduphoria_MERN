import { ADMIN_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const getJWTToken = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? userInfo.token : null;
};
export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   
    getPendingTeachers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/pending-teachers`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      providesTags: ["Admin"],
    }),

  
    acceptTeacher: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/accept-teacher/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Admin"],
    }),


    declineTeacher: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/decline-teacher/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Admin"],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/block-user/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Admin"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/delete-user/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Admin"],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/delete-course/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Admin"],
    }),

    sendMails:builder.mutation({
      query:({ subject, message })=>({
        url:`${ADMIN_URL}/send-mail`,
        method:"POST",
        body:{subject,message},
        headers:{
          Authorization:`Bearer ${getJWTToken()}`,
        }
      }),
      invalidatesTags:['Admin']
    }),

    adminAddCourse: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/add-course`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${getJWTToken()}`,
        },
      }),
      invalidatesTags: ["Course"],
    }),


  }),
});

export const {
  useGetPendingTeachersQuery,
  useAcceptTeacherMutation,
  useDeclineTeacherMutation,
  useDeleteUserMutation,
  useDeleteCourseMutation,
  useBlockUserMutation,
  useSendMailsMutation,
  useAdminAddCourseMutation
} = adminApiSlice;
