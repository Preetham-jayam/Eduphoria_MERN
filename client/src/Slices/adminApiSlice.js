import { ADMIN_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const JWT_TOKEN = userInfo ? userInfo.token : null;

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   
    getPendingTeachers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/pending-teachers`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }),
      providesTags: ["Admin"],
    }),

  
    acceptTeacher: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/accept-teacher/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }),
      invalidatesTags: ["Admin"],
    }),


    declineTeacher: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/decline-teacher/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }),
      invalidatesTags: ["Admin"],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/block-user/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }),
      invalidatesTags: ["Admin"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/delete-user/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetPendingTeachersQuery,
  useAcceptTeacherMutation,
  useDeclineTeacherMutation,
  useDeleteUserMutation,
  useBlockUserMutation
} = adminApiSlice;
