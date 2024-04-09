import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useTitle } from "../Hooks/title-hook";
import HeroBanner from "../components/HomeComponents/HeroBanner";
import Testimonial from "../components/HomeComponents/Testimonial";
import Teach from "../components/HomeComponents/Teach";
import Instructors from "../components/HomeComponents/Instructors";
import CourseList from "../components/Courses/CourseList";
import EnrolledCourseList from "../components/Courses/EnrolledList";
import Header from "../components/Header/Header";
import Loader from "../components/Loader/Loader";
import { useGetUserDetailsQuery } from "../Slices/usersApiSlice";
import { useGetCoursesQuery } from "../Slices/courseApiSlice";
import AdminDashboard from "../components/AdminDashboard/AdminDashboard";
import waiting from '../Assets/waiting.avif';
const Home = () => {
  const [courseData, setCourseData] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const auth = useSelector((state) => state.auth);

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useGetUserDetailsQuery(auth.userInfo?.userId);
  const {
    data: courses,
    isLoading: courseLoading,
    isError: courseError,
  } = useGetCoursesQuery();

  useTitle("Home Page");

  useEffect(() => {
    if (courses) {
      setCourseData(courses.courses.slice(0,4) || []);
    }
  }, [courses]);

  useEffect(() => {
    if (user) {
      if (auth.loggedIn && user.user.role === 1) {
        setUserCourses(user.user.teacher.courses);
      }
      if (auth.loggedIn && user.user.role === 0) {
        setUserCourses(user.user.student.courses);
      }
    }
  }, [auth.loggedIn, user]);

  useEffect(() => {
    if (auth.loggedIn && userError) {
      console.error("Error fetching user details:", userError);
    }
    if (courseError) {
      console.error("Error fetching courses:", courseError);
    }
  }, [userError,auth, courseError]);

  if (userLoading || courseLoading) {
    return <Loader />;
  }

  if (!auth.loggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroBanner />
        <h1>Popular Courses</h1>
        <CourseList courses={courseData} />
        <Teach />
        <Testimonial />
        <Instructors />
      </motion.div>
    );
  }

  if(!user){
    return(
      <h1>No user found</h1>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      {user.user.role === 2 && <> 
      <Header user={user.user}/>
      <AdminDashboard />
      </>}

      {user.user.role===0 && (
        <>
        <Header user={user.user} />
        <EnrolledCourseList courses={userCourses} user={user.user} />
          <Testimonial />
          <Instructors />
        </>
        
      )}

      {user.user.role===1 && user.user.teacher.flag===0 && (
        <>
         <div>
         <h1>Hello {user.user.teacher.FullName}</h1>
         <div style={{textAlign:'center'}}>
         <h2>You are not approved by admin just wait some time.....</h2>
         <img src={waiting} alt="waiting pic"/>
         </div>
         </div>
        </>
      )}

    {user.user.role===1 && user.user.teacher.flag===2 && (
            <>
            <div>
            <h1>Hello {user.user.teacher.FullName}</h1>
            <div style={{textAlign:'center'}}>
            <h2>You are not approved by admin .</h2>
            
            </div> 
            </div> 
            </>
          )}

      {user.user.role === 1 && user.user.teacher.flag===1 && (
        <>
        <Header user={user.user} />
        <EnrolledCourseList courses={userCourses} user={user.user} />
          <Testimonial />
          <Instructors />
        </>
      )}
    </motion.div>
  );
};

export default Home;
