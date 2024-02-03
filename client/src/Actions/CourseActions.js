import {
  getAllCoursesStart,
  getAllCoursesSuccess,
  getAllCoursesFailure,
  updateCourse as updateCourseAction,
  addCourse as addCourseAction,
} from '../Slices/CourseSlice'; 
import { updateUser as updateUserAction } from '../Slices/UserSlice';

export const fetchAllCourses = () => async (dispatch) => {
  try {
    dispatch(getAllCoursesStart());

    const response = await fetch('http://localhost:8000/courses');

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    const courses = await response.json();
    dispatch(getAllCoursesSuccess(courses));
  } catch (error) {
    dispatch(getAllCoursesFailure(error.message));
  }
};


export const updateCourse = (courseId, updatedCourse) => async (dispatch) => {
  try {
    dispatch(getAllCoursesStart());

    const response = await fetch(`http://localhost:8000/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCourse),
    });

    if (!response.ok) {
      throw new Error(`Failed to update course: ${response.statusText}`);
    }
    const updatedCourseFromAPI = await response.json();
    dispatch(updateCourseAction({ courseId, updatedCourse: updatedCourseFromAPI }));

    dispatch(fetchAllCourses());

    dispatch(getAllCoursesSuccess('Courses updated successfully'));
  } catch (error) {
    dispatch(getAllCoursesFailure(error.message));
  }
};

export const addCourse = (userId,courseData) => async (dispatch) => {
  try {
    dispatch(getAllCoursesStart());
    const response = await fetch("http://localhost:8000/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) {
      throw new Error(`Failed to add course: ${response.statusText}`);
    }
    const newCourse = await response.json();

    dispatch(addCourseAction(newCourse));
    const userResponse = await fetch(`http://localhost:8000/user/${userId}`);
    const userData = await userResponse.json();

    userData.teachingCourses.push(newCourse.id);

    await fetch(`http://localhost:8000/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    dispatch(updateUserAction({ userId, updatedUser: userData }));

    dispatch(fetchAllCourses());
    dispatch(getAllCoursesSuccess('Course added successfully'));
  } catch (error) {
    dispatch(getAllCoursesFailure(error.message));
  }
};

