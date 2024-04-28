import React, { useState, useEffect } from "react";
import { useTitle } from "../Hooks/title-hook";
import { motion } from "framer-motion";
import CourseList from "../components/Courses/CourseList";
import { useGetCoursesQuery } from "../Slices/courseApiSlice";
import { useGetUserDetailsQuery } from "../Slices/usersApiSlice";
import GoBackButton from "../shared/components/FrontendTools/GoBack";
import Loader from "../components/Loader/Loader";
import { useSelector } from "react-redux";

const useUserData = (userId, loggedIn) => {
  const { data, isLoading, isError } = useGetUserDetailsQuery(userId);
  
  useEffect(() => {
    if (loggedIn && isError) {
      console.error("Error fetching user details:", isError);
    }
  }, [loggedIn, isError]);

  return { data, isLoading, isError };
};

const Courses = () => {
  useTitle("Courses Page");

  const [courseData, setCourseData] = useState([]);
  const [sortValue, setSortValue] = useState("");
  const auth = useSelector((state) => state.auth);

 // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: userData, isLoading: userLoading, isError: userError } = auth.loggedIn ? useUserData(auth.userInfo?.userId, auth.loggedIn):{};
  const user = userData?.user;


  const { data: courses, isLoading: courseLoading, isError: courseError } = useGetCoursesQuery();

 
  useEffect(() => {
    if (courses) {
      setCourseData(courses.courses || []);
    }
  }, [courses]);

  useEffect(() => {
    if (auth.loggedIn && userError) {
      console.error("Error fetching user details:", userError);
    }
  }, [userError,auth]);
  
  useEffect(() => {
    if (courseError) {
      console.error("Error fetching courses:", courseError);
    }
  }, [courseError]);
  

  const enrolledCourseIds = user && user?.student?.courses.map(course => course._id);
  const otherCourses =user &&( user?.role === 0 ? courseData.filter(course => !enrolledCourseIds.includes(course._id)) : []);


  const sortHandler = () => {
    if (sortValue === "price:asc") {
      setCourseData([...courseData].sort((a, b) => a.price - b.price));
    } else if (sortValue === "price:desc") {
      setCourseData([...courseData].sort((a, b) => b.price - a.price));
    } else if (sortValue === "title:asc") {
      setCourseData([...courseData].sort((a, b) => a.title.localeCompare(b.title)));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GoBackButton />
      <div className="courses">
        <h2
          style={{
            fontSize: "2.5rem",
            margin: "2rem 0",
            color: "#000",
            textDecoration: "underline",
            textAlign: "center",
          }}
        >
          Courses Page
        </h2>
        <div className="sortFilter">
          <div className="sort-formGroup">
            <label className="sort-label" htmlFor="sort">
              Sort by:
            </label>
            <select
              className="sort-select"
              name="sort"
              id="sort"
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="title:asc">Title: A to Z</option>
            </select>
            <button
              type="button"
              id="sort-button"
              className="read-more-button"
              onClick={sortHandler}
            >
              Sort
            </button>
          </div>
        </div>
        {userLoading || courseLoading ? (
          <Loader />
        ) : (
          <CourseList courses={auth && auth.userInfo && auth.userInfo.role === 0 ? otherCourses : courseData} />
        )}
      </div>
    </motion.div>
  );
};

export default Courses;
