import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import User1 from '../../Assets/User1.png'
import User2 from '../../Assets/User2.png'
import User3 from '../../Assets/User3.png'
import User4 from '../../Assets/User4.png'
import User5 from '../../Assets/User5.png'
import './Testimonial.css'; 

const Testimonial = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: 'Preetham',
      quote: "I've learned so much from this platform. The courses are top-notch, and the instructors are experts in their fields.",
      image: User5,
    },
    {
      name: 'Chaitanya',
      quote: 'The interactive lessons and quizzes have made my learning experience enjoyable and effective. I highly recommend it!',
      image: User4,
    },
    {
      name: 'Abhishikth',
      quote: "This e-learning platform has been a game-changer for me. It's convenient, flexible, and has helped me advance in my career.",
      image: User3,
    },
    {
      name: 'Narasimha',
      quote: "I can't believe how much I've grown as a learner. The variety of courses is impressive, and the support is outstanding.",
      image: User1,
    },
    {
      name: 'Manjith',
      quote: "The quality of education here is unmatched. I'm grateful for the opportunity to expand my knowledge and skills.",
      image: User2,
    },
  ];

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="testimonials-container">
      <h1 style={{textDecoration:'underline'}}>Student Testimonials</h1>
      <div className="testimonial-slider">
        <button className="nav-button left" onClick={handlePrevClick}>
          <FaArrowLeft />
        </button>
        <div className="testimonial">
          <div className="image-container">
            <img className='testimonial-image' src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
          </div>
          <p className="quote">{testimonials[currentIndex].quote}</p>
          <p className="name">{testimonials[currentIndex].name}</p>
        </div>
        <button className="nav-button right" onClick={handleNextClick}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Testimonial;