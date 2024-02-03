
import {
    getAllUsersFailure,getAllUsersStart,getAllUsersSuccess
  } from '../Slices/UserSlice';
  
  export const fetchAllUsers = () => async (dispatch) => {
    try {
      dispatch(getAllUsersStart());
  
      const response = await fetch('http://localhost:8000/user');
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
  
      const users = await response.json();
      dispatch(getAllUsersSuccess(users));
    } catch (error) {
      dispatch(getAllUsersFailure(error.message));
    }
  };
  