import { apiSlice } from "./Slices/apiSlice";
import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/authenticationSlice";
import courseReducer from "./Slices/CourseSlice";
import userReducer from "./Slices/UserSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
   
    courseSlice: courseReducer,
    user: userReducer,
    auth:authSliceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
