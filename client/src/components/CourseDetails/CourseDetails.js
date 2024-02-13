import React, { useEffect, useState } from "react";
import {useSelector} from 'react-redux';
import { useParams,useNavigate } from "react-router-dom";
import Tab from "../Tabs/Tab";
import { FaCode, FaUniversity } from "react-icons/fa";
import "./CourseDetails.css";
import Accordion from "../CourseContent/Accordion";
import { useGetCourseDetailsQuery ,useGetCourseReviewsQuery} from "../../Slices/courseApiSlice";
import Loader from "../Loader/Loader";
import {
  FaStar,
  FaStarHalfAlt,
  FaVideo,
  FaDownload,
  FaNewspaper,
  FaMobileAlt,
  FaTrophy,
} from "react-icons/fa";
const CourseDetails = () => {
  
  const navigate=useNavigate();
  const { id: courseId } = useParams();
  const auth=useSelector((state)=>state.auth);
  const {data,isLoading:courseLoading,isError:courseError}=useGetCourseDetailsQuery(courseId);
  const {data:reviewData,isLoading:reviewLoading,isError:reviewError}=useGetCourseReviewsQuery(courseId);
  const [course, setCourse] = useState([]);
  const [price,setPrice]=useState(0);
  const [reviews, setReviews] = useState([]);
  const [courseChapters,setCourseChapters]=useState([]);

  
  useEffect(()=>{
    if(data){
      setCourse(data.course);
      setCourseChapters(data.course.chapters);
      setPrice(course.price);
    }
    if(reviewData){
      setReviews(reviewData.reviews);
    }
  },[data,course.price,reviewData]);
  useEffect(() => {

    if(courseError){
      console.log("error fetching course:",courseError);
    }

    if(reviewError){
      console.log("Error while fetching reviews :",reviewError);
    }
   
  }, [courseError,reviewError]);
  let discount=parseInt(((10999-price)/10999)*100);
 
  



  const tabs = [
    {
      label: "Curriculum",
      content: (
        <>
        <Accordion
          course={course}
          courseData={courseChapters}
          enrolled={false}
        />
          
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
              love both worlds nowadays! I also build full-stack applications
              and acquired expert DevOps and cloud computing knowledge - proven
              by the many AWS certifications I hold (incl. the top-level
              Solutions Architect Professional certification). As a self-taught
              developer I had the chance to broaden my horizon by studying
              Business Administration where I hold a Master's degree. That
              enabled me to work in a major strategy consultancy as well as a
              bank. While learning, that I enjoy development more than these
              fields, the time in this sector greatly improved my overall
              experience and skills.
            </p>
          </div>
        </>
      ),
    },
    {
      label: "Reviews",
      content: <>
      <div className="reviews-container">
            <h2 className="reviews-title">Student Reviews</h2>
            {reviews.length===0 && <h3>No Reviews Yet!!</h3>}
            <div className="review-list">
              {reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <div className="review-author">{review.author}</div>
                    <div className="review-date">{review.date}</div>
                  </div>
                  <div className="review-rating">
                    <span className="star">&#9733;</span> {review.rating}
                  </div>
                  <div className="review-comment">{review.comment}</div>
                </div>
              ))}
            </div>
          </div>
      </>,
    },
  ];

  const handlePayment=()=>{

    if(!auth.loggedIn){
      navigate('/signin');
    } else{
      navigate(`/enroll/${courseId}`);

    }

    
  }

  if(courseLoading || reviewLoading){
    return <Loader/>;
  }

  return (
    <div className="course-main-box">
      <div className="course-header">
        <div className="box">
          <h2 className="course-title">
            Course Title :
            <span style={{ fontWeight: "normal", color: "#06bbcc" }}>
              {course.title} 
            </span>
          </h2>
          <div className="rating">
            <div className="custom-box">
              <span className="average-rating">(4.5)</span>
              <span className="average-stars">
                <FaStar className="i-star" />
                <FaStar className="i-star" />
                <FaStar className="i-star" />
                <FaStar className="i-star" />
                <FaStarHalfAlt className="i-star" />
              </span>
              <span className="reviews">({reviews.length} Reviews)</span>
            </div>

            <ul>
              <li className="items-4">
                Enrolled students - <span>10</span>
              </li>
              <li className="items-4">
                Created by - <span>{course.instructorName}</span>
              </li>
              <li className="items-4">
                Last Updated - <span>10/08/23</span>
              </li>
              <li className="items-4">
                Language - <span>English</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="box">
          <div className="course-details-section">
            {course && <Tab tabs={tabs} />}
          </div>
        </div>
      </div>

      <div className="course-sidebar">
        <div className="img-box position-relative">
          <img src={`http://localhost:8000/${course.Imageurl}`} className="course-image" alt={course.title} />
          <h2 style={{ textAlign: "center" }}>Course Details</h2>
        </div>
        <div className="center-items">
          <div className="price">
            <span className="price-old">₹10999</span>
            <span className="price-new">₹{course.price}</span>
            <span className="price-discount">{discount}% off</span>
          </div>
          <h3>Course Features:</h3>
          <ul className="features-list">
            <li>
              <FaVideo />
              Total 15 Lessons
            </li>
            <li>
              <FaDownload />
              Downloadable resources
            </li>
            <li>
              <FaNewspaper />
              10 articles
            </li>
            <li>
              <FaMobileAlt />
              Access on mobile
            </li>
            <li>
              <FaTrophy />
              Certificate of Completion
            </li>
          </ul>
        {auth.userInfo.role===0 && <>
          <button className="join-button" onClick={handlePayment}>
            Enroll Now
          </button>

        </>}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
