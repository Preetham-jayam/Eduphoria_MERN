import React, { useEffect, useState } from "react";
import Accordion from "./Accordion";
import "./CourseContent.css";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { FaCode, FaUniversity } from "react-icons/fa";
import Tab from "../Tabs/Tab";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useGetUserDetailsQuery } from "../../Slices/usersApiSlice";
import { useGetCourseDetailsQuery } from "../../Slices/courseApiSlice";
import { useAddReviewMutation } from "../../Slices/studentApiSlice";
import { useGetCourseReviewsQuery } from "../../Slices/courseApiSlice";
import { useUpdateCompletedLessonsMutation } from "../../Slices/studentApiSlice";
import Loader from "../Loader/Loader";

const CourseContent = () => {
  const auth = useSelector((state) => state.auth);
  const { id: courseId } = useParams();
  const [addReview] = useAddReviewMutation();
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError
  } = useGetUserDetailsQuery(auth.userInfo?.userId);
  const {
    data,
    isLoading: courseLoading,
    isError: courseError,
  } = useGetCourseDetailsQuery(courseId);
  const {
    data: coursereviewData,
    isLoading: reviewLoading,
    isError: reviewError,
    refetch
  } = useGetCourseReviewsQuery(courseId);

  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [course, setCourse] = useState([]);
  const [rating, setRating] = useState("1");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [courseChapters, setCourseChapters] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [percentage,setPercentage]=useState(0);


  useEffect(() => {
    if (data) {
      setCourse(data.course);
      setCourseChapters(data.course.chapters);
    }
    if (userData) {
      setUser(userData.user);
      setStudent(userData.user.student);
      setCompletedLessons(
        userData.user.role === 0 ? userData.user.student.completedLessons : null
      );

    }
    if (coursereviewData) {
      setReviews(coursereviewData.reviews);
      console.log(reviews);
    }
  }, [data, userData, coursereviewData,reviews]);

  useEffect(() => {
    if (courseChapters.length > 0) {
     courseChapters[0].lessons.length>0 && setSelectedVideoUrl(courseChapters[0].lessons[0].videoUrl);
    }
  }, [courseChapters]);

  useEffect(() => {
    if (userError) {
      console.error("Error fetching user details:", userError);
    }
    if (courseError) {
      console.error("Error fetching courses:", courseError);
    }
    if (reviewError) {
      console.log("Error fetchng Reviews :", reviewError);
    }
  }, [userError, courseError, reviewError]);

  useEffect(() => {
    if (!course || !course.chapters) {
      return;
    }
    const totalLessonsCount = courseChapters
      ? courseChapters.reduce(
          (count, chapter) => count + chapter.lessons.length,
          0
        )
      : 0;

    setTotalLessons(totalLessonsCount);

    console.log(totalLessonsCount);

    if (user && user.role === 0) {
      const studentCompletedLessonIds = student.completedLessons.map(lesson => lesson._id) || [];
      let completedLessonsCount = 0;
  
      course.chapters.forEach((chapter) => {
        chapter.lessons.forEach((lesson) => {
          if (studentCompletedLessonIds.includes(lesson._id)) {
            completedLessonsCount++;
          }
        });
      });
      const percentage = (completedLessonsCount / totalLessons) * 100;
      setPercentage(percentage); 
    }
  }, [user, course, student, courseChapters, percentage, totalLessons]);

 

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setRating("1");
    setComment("");

    const reviewData = {
      courseId: courseId,
      studentName: student.firstName,
      rating: parseInt(rating, 10),
      comment,
      todaysdate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    try {
      const { data } = await addReview(reviewData);
      setReviews([...reviews, data]);
      refetch();
      toast.success(data.message);
    } catch (error) {
      console.error("Error submitting review:", error.message);
      toast.error("Failed to add review");
    }
  };

  const tabs = [
    {
      label: "Overview",
      content: (
        <>
          <div>
            <h2>
              Course Title :{" "}
              <span style={{ fontWeight: "bolder",color:'#06bbcc' }}>
                {course.title}
              </span>
            </h2>
            <div>
              <h2>Description:{" "}
              <span style={{ fontWeight: "bolder",color:'#06bbcc' }}>
                {course.description}
              </span>
              </h2>
            </div>
          </div>
          <div className="course-information">
            <div className="rating-section">
              <span className="star-rating">
                4.5 <i className="fas fa-star"></i>
              </span>
              <br />
              <p className="rating-count">5 Ratings</p>
            </div>
            <div className="student-section">
              <span className="student-count">10</span>
              <br />
              Students
            </div>
            <div className="hours-section">
              <span className="hours-count">10 Hours</span>
              <br />
              Total
            </div>
          </div>
          <div className="what-learn">
            <h2>What you'll Learn</h2>
            <ul className="learn-list">
              <li>Course Introduction</li>
              <li>Understanding Course Objectives</li>
              <li>Exploring Key Concepts</li>
              <li>Hands-on Practice</li>
            </ul>
          </div>
        </>
      ),
    },
    {
      label: "Instuctor",
      content: (
        <>
          <div className="instructor-container">
            <div className="instructor-info">
              <h5>{course.instructorName}</h5>
              <p>Web Developer</p>
            </div>
            <div className="instructor-updated">
              <p>
                <FaCode /> Updated on March 2023
              </p>
            </div>
            <div className="instructor-institute">
              <p>
                <FaUniversity /> Institute: IIT KGP
              </p>
            </div>
          </div>
          <div className="instructor-experience">
            <h2>Experience:</h2>
            <p>
              Experience as (Web) Developer Starting out at the age of 12 I
              never stopped learning new programming skills and languages. Early
              I started creating websites for friends and just for fun as well.
              Besides web development I also explored Python and other
              non-web-only languages. This passion has since lasted and lead to
              my decision of working as a freelance web developer and
              consultant. The success and fun I have in this job is immense and
              really keeps that passion burningly alive. Starting web
              development on the backend (PHP with Laravel, NodeJS, Python) I
              also became more and more of a frontend developer using modern
              frameworks like React, Angular or VueJS in a lot of projects. I
              love both worlds nowadays!
            </p>
          </div>
        </>
      ),
    },
    {
      label: "Reviews",
      content: (
        <div>
          <div className="review-form-container">
            <h2>Submit a Review</h2>
            <form onSubmit={submitReviewHandler}>
              <div className="review-input">
                <label htmlFor="rating">Rating:</label>
                <select
                  id="rating"
                  name="rating"
                  required
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="review-input">
                <label htmlFor="comment">Comment:</label>
                <textarea
                  id="comment"
                  name="comment"
                  required
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <div className="review-input">
                <button type="submit">Submit Review</button>
              </div>
            </form>
          </div>
          <div className="reviews-container">
            <h2>Reviews</h2>
            <ul className="reviews-list">
              {reviews.length === 0 && <h3>No Reviews Yet!!</h3>}
              {reviews.length > 0 &&
                reviews.map((review, index) => (
                  <li key={index} className="review-item">
                    <div className="review-header">
                      <p className="review-author">{review.studentName}</p>
                      <p className="review-date">{review.todaysdate}</p>
                    </div>
                    <div className="review-rating">
                      <span className="star">&#9733;</span> {review.rating}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ),
    }
  ];

  if (userLoading || courseLoading || reviewLoading) {
    return <Loader />;
  }

  return (
    <>
     
    <div className="course-page">
      <div className="course-content">
        <div className="main-content">
          <div className="video-player-container">
            {selectedVideoUrl && (
              <VideoPlayer
                student={student}
                url={selectedVideoUrl}
                completedLessons={completedLessons}
                setCompletedLessons={setCompletedLessons}
                courseData={courseChapters}
              />
            )}
          </div>
          <div className="course-details-section">
            {course && <Tab tabs={tabs} />}
          </div>
        </div>
      </div>

      <div className="sidebar">
        <Accordion
          course={course}
          courseData={courseChapters}
          setSelectedVideoUrl={setSelectedVideoUrl}
          enrolled={true}
          completedLessons={completedLessons}
          percentage={percentage}
        />
      </div>
    </div>
     </>
  );
};

const updateCompletedLessons = (
  studentId,
  completedLessons,
  updateCompletedLessonsMutation,
  refetchUser
) => {
  updateCompletedLessonsMutation({
    studentId,
    completedLessons,
  })
    .unwrap()
    .then((updatedUser) => {
      refetchUser();
      
      console.log("User data updated with completed lessons:", updatedUser);
    })
    .catch((err) => {
      console.error("Error updating user data:", err.message);
    });
};

const VideoPlayer = ({
  student,
  url,
  completedLessons,
  setCompletedLessons,
  courseData,
}) => {
  const [updateCompletedLessonsMutation] = useUpdateCompletedLessonsMutation();
  const {refetch:refetchUser}=useGetUserDetailsQuery();
  const backendURLPrefix = 'http://localhost:8000';
  const handleVideoEnded = () => {
    const updatedCompletedLessons = [...completedLessons];

    courseData.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        if (lesson.videoUrl === url) {
          const lessonId = lesson._id;
          if (!completedLessons.includes(lessonId)) {
            updatedCompletedLessons.push(lessonId);
          }
        }
      });
    });
    
    setCompletedLessons(updatedCompletedLessons);
    updateCompletedLessons(
      student._id,
      updatedCompletedLessons,
      updateCompletedLessonsMutation,
      refetchUser
    );
  };
  const updatedUrl = `${backendURLPrefix}/${url}`;

  return (
    <div className="video-player">
      <ReactPlayer
        url={updatedUrl}
        controls
        width="100%"
        height="100%"
        className="react-player"
        onEnded={handleVideoEnded}
      />
    </div>
  );
};

export default CourseContent;