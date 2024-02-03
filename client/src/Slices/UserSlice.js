import { createSlice } from '@reduxjs/toolkit';

const storedUserdata = JSON.parse(localStorage.getItem('userData'));

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: storedUserdata || null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
  },
 
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
