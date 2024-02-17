import React, { useEffect, useState } from "react";
import "./Accordion.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Certificate from "../Certificate/Certificate";
import { useGetUserDetailsQuery } from "../../Slices/usersApiSlice";
import Loader from "../Loader/Loader";
const Accordion = ({
  course,
  courseData,
  setSelectedVideoUrl,
  enrolled,
  percentage,
}) => {

  console.log(percentage);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const {
    data,
    isLoading: userLoading,
    isError: userError,
  } = useGetUserDetailsQuery(auth.userInfo?.userId);
  const loggedIn = auth.loggedIn;
  const [activeChapter, setActiveChapter] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons,setCompletedLessons]=useState([]);
  const [sCourses,setSCourses]=useState(null);
  const id = course._id;

  useEffect(() => {
    if (data && data.user) {
      setUser(data.user);
      if (data.user.role === 0 && data.user.student) {
        setSCourses(data.user.student.courses);
        const lessonIds = data.user.student.completedLessons.map(lesson => lesson.id);
        setCompletedLessons(lessonIds);
        
      }
      
    }
  }, [data]);



  useEffect(() => {
    if (userError) {
      console.log("Error fetching user details:", userError);
    }
  }, [userError]);

  const toggleChapter = (chapterIndex) => {
    if (activeChapter === chapterIndex) {
      setActiveChapter(null);
      setActiveLesson(null);
    } else {
      setActiveChapter(chapterIndex);
      setActiveLesson(null);
    }
  };

  const toggleLesson = (lessonIndex) => {
    setActiveLesson(lessonIndex);
  };

  const handleLessonClick = (videoUrl) => {
    if (enrolled === true) {
      setSelectedVideoUrl(videoUrl);
    }
  };

  if (userLoading) {
    return <Loader />;
  }

  return (
    <div className="accordion">
      <h2>Course Content</h2>

      {courseData.length === 0 && <h3>No Chapters are added yet!!</h3>}
      {courseData.map((chapter, chapterIndex) => (
        <div key={chapterIndex}>
          <div
            className={`accordion-title ${
              chapterIndex === activeChapter ? "active" : ""
            }`}
            onClick={() => toggleChapter(chapterIndex)}
          >
            {chapter.name}
          </div>
          {enrolled && (
            <div
              className={`accordion-chapters ${
                chapterIndex === activeChapter ? "open" : ""
              }`}
            >
              {chapter.lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className={`lesson-item ${
                    lesson.id === activeLesson ? "active" : ""
                  }`}
                  onClick={() => {
                    toggleLesson(lesson._id);
                    handleLessonClick(lesson.videoUrl);
                  }}
                >
                  <label>
                    {auth.userInfo.role === 0 && (
                      <>
                        <input
                          type="checkbox"
                          checked={completedLessons.includes(lesson._id)}
                          onChange={() => {}}
                        />
                      </>
                    )}
                    {lesson.title}
                  </label>
                </div>
              ))}
            </div>
          )}
          {!enrolled && (
            <div
              className={`accordion-chapters ${
                chapterIndex === activeChapter ? "open" : ""
              }`}
            >
              {chapter.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className={`lesson-item ${
                    lessonIndex === activeLesson ? "active" : ""
                  }`}
                  onClick={() => {
                    toggleLesson(lessonIndex);
                  }}
                >
                  {lesson.title}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {loggedIn && enrolled && auth.userInfo.role === 0 && percentage >= 80 && (
        <Certificate
          userName={user.student.firstName}
          courseTitle={course.title}
          instructorName={course.instructorName}
        />
      )}

      {loggedIn && auth.userInfo.role === 0 && sCourses&& sCourses.some(course => course._id === id)&&(
        <>
          <div className="attempt-div">
            <Link to={`/student/quiz/${id}`}>
              <button className="attempt-quiz">Attempt Quiz</button>
            </Link>
          </div>
        </>
      )}
      {loggedIn && auth.userInfo.role === 1  &&(
        <>
          <div className="edit-div">
            <Link to={`/course/edit/${id}`}>
              <button className="edit">Edit</button>
            </Link>
          </div>
          <div className="upload-div">
            <Link to={`/course/upload/${id}`}>
              <button className="upload">Upload</button>
            </Link>
          </div>
          <div className="upload-div">
            <Link to={`/course/addquiz/${id}`}>
              <button className="upload">Add Quiz</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Accordion;
