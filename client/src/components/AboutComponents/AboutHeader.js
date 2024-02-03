import React from 'react';
import './AboutHeader.css'; 
import About from '../../Assets/about.png';
import {  FaChalkboardTeacher,FaRecordVinyl} from 'react-icons/fa';
import {GrCertificate} from 'react-icons/gr';
import {MdQuiz} from 'react-icons/md'
const AboutHeader = () => {
  return (
    <div className="about-us-page">
      <h1 className="about-us-heading">About Us Page</h1>
      <div className="about-us-content">
        <div className="about-us-image">
          <div className="image-container">
            <img
              src={About}
              alt="about Img"
              className="image"
              loading='lazy'
            />
          </div>
        </div>
        <div className="about-us-text">
          <h1 className="about-us-title">Welcome to Eduphoria!!</h1>
          <p className="about-us-paragraph">

            Education helps us get exposure to new ideas and concepts that we can use to appreciate and improve the world around us and the world within us.
          </p>
          <p className="about-us-paragraph">
            All things are possible because anything can be learned.
          </p>
          <div className="about-us-features">
            <div className="feature">
              <p>
                <span className='feauture-icon'><MdQuiz style={{fontSize:'24px'}}/></span>
               Quizzes
              </p>
            </div>
            <div className="feature">
              <p>
                <span className="feature-icon"><GrCertificate/></span> Certificate
              </p>
            </div>
            <div className="feature">
              <p>
                <span className="feature-icon"><FaChalkboardTeacher/></span> Skilled Instructors
              </p>
            </div>
            <div className="feature">
              <p>
                <span className="feature-icon"><FaRecordVinyl/></span> Recorded Classes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHeader;
