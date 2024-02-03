// courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCourseData = createAsyncThunk(
  'courses/fetchCourseData',
  async () => {
    const response = await fetch('http://localhost:8000/api/courses');
    const data = await response.json();
    return data.courses;
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    coursesData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null; 
        state.coursesData = action.payload;
      })
      .addCase(fetchCourseData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectCourses = (state) => state.courses.coursesData;

export default courseSlice.reducer;
