import React from "react";
import Instructor1 from '../../Assets/Teacher1.jpeg'
import Instructor2 from '../../Assets/Teacher2.jpeg'
import Instructor3 from '../../Assets/Teacher3.jpeg'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "./Instructors.css";

const teachers = [
  {
    id:1,
    name: "kevin",
    role: "Web Development",
    content:
      "As a seasoned Web Developer, I bring a wealth of experience in harnessing the power of data to drive informed decision-making and optimize online strategies. With a track record of 9 years in the field, I have honed my skills in collecting, processing, and analyzing web data to extract valuable insights that propel businesses forward",
    img: Instructor1,
  },
  {
    id:2,
    name: "Max",
    role: "Data Analyst",
    content:
      "As a seasoned Data Analyst, I bring a wealth of experience in harnessing the power of data to drive informed decision-making and optimize online strategies. With a track record of 6 years in the field, I have honed my skills in collecting, processing, and analyzing web data to extract valuable insights that propel businesses forward",
    img: Instructor2,
  },
  {
    id:3,
    name: "Linda",
    role: "Full Stack Developer",
    content:
      "As a seasoned FullStackDeveloper, I bring a wealth of experience in harnessing the power of data to drive informed decision-making and optimize online strategies. With a track record of 5 years in the field, I have honed my skills in collecting, processing, and analyzing web data to extract valuable insights that propel businesses forward",
    img: Instructor3,
  },
];

const Instructors = () => {
  return (
    <>
      <h1 style={{textDecoration:'underline'}}>Expert Instructors</h1>
      <div className="container" >
        {teachers.map((teacher) => (
          <div className="card" key={teacher.id}>
            <div className="card-title">
              <h3>{teacher.name}</h3>
            </div>
            <div className="card-image">
              <img src={teacher.img} alt="kevin" />
            </div>
            <div className="card-content">
              <div className="skills">{teacher.role}</div>
              <p>{teacher.content}</p>
            </div>
            <div className="card-footer">
              <div className="social-icon">
                <FaFacebook />
              </div>
              <div className="social-icon">
                <FaInstagram />
              </div>
              <div className="social-icon">
                <FaTwitter />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Instructors;
