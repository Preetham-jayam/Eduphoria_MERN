// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setUserData } from './UserSlice';

const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: storedUserInfo || null,
    loggedIn: !!storedUserInfo,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.loggedIn = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      state.loggedIn = false;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userData');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (userId, { getState, dispatch }) => {
    const token = getState().auth.userInfo.token;
    const response = await fetch(`http://localhost:8000/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    dispatch(setUserData(data.user)); 
    return data.user;
  }
);
