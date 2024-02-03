import React from 'react';
import { Link } from 'react-router-dom'; 
import './Teach.css';
import TeachUs from '../../Assets/Teachus.jpg'

const Teach = () => {
  return (
    <div className='teach-container'>
      <div className='teach-left'>
        <img src={TeachUs} alt='Teach' />
      </div>
      <div className='teach-right'>
        <h2 className='teach-heading'>Teach on Our Platform</h2>
        <p className='teach-text'>Share your knowledge and expertise with students around the world. Join our community of educators and
          help learners achieve their goals. Whether you're a seasoned professional or just starting, we welcome
          passionate individuals like you</p>
        <Link to='/tsignup'>
          <button className='teach-now-button'>Teach Now</button>
        </Link>
      </div>
    </div>
  );
};

export default Teach;
