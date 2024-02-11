import React from "react";
import Home from "../Pages/Home";
import About from "../Pages/About";
import SignIn from "../Pages/SignIn";
import StudentSignup from "../Pages/StudentSignup";
import TeacherSignup from "../Pages/TeacherSignup";
import Help from "../Pages/Help";
import { AnimatePresence } from "../../node_modules/framer-motion/dist/framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AddCourse from './TeacherHomeComponents/AddCourse';
import Courses from "../Pages/Course";
import CourseDetails from "./CourseDetails/CourseDetails";
import EnrollPayment from "./Payment/EnrollPayment";
import CourseContent from "./CourseContent/CourseContent";
import CourseUploadPage from "../Pages/CourseUploadPage";
import ProfilePage from '../Pages/ProfilePage';
import AccountEditPage from "../Pages/AccountEditPage";
import AddQuizPage from '../Pages/AddQuizPage';
import StudentQuizPage from '../Pages/StudentQuizPage';

const AnimatedRoutes = () => {
  const location = useLocation();

  
  

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route  path="/" element={<Home/>} />
        <Route path='/courses' element={<Courses/>}/>
        <Route  path="/about" element={<About />} />
        <Route  path='/help' element={<Help/>} />
        <Route  path="/signin" element={<SignIn />} />
        <Route  path="/signup" element={<StudentSignup />} />
        <Route  path="/tsignup" element={<TeacherSignup />} />
        <Route path='/AddCourse' element={<ProtectedRoute><AddCourse/></ProtectedRoute>} />
        <Route path ='/courseDetails/:id' element={<CourseDetails/>}/>
        <Route path='/enroll/:cid' element={<EnrollPayment/>}/>
        <Route path='/courseContent/:id' element={<CourseContent/>}/>
        <Route path='/course/upload/:id' element={<ProtectedRoute><CourseUploadPage/></ProtectedRoute>} />
        <Route path='/course/addquiz/:id' element={<ProtectedRoute><AddQuizPage/></ProtectedRoute>}/>
        <Route path='/profile' element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
        <Route path='/student/quiz/:id' element={<ProtectedRoute><StudentQuizPage/></ProtectedRoute>} />
        <Route path='/profile/editaccount' element={<ProtectedRoute><AccountEditPage/></ProtectedRoute>}/>
        

        
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
