import React from 'react';
import './HeroBanner.css'; 
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h1 className="hero-title">Unlock Your Potential</h1>
        <p className="hero-subtitle">Learn, Grow, and Excel with Our Online Courses</p>
        <p className='hero-subtitle'>Get Educated Online From Your Home.Register now and Enroll the courses and lets break the records.</p>
        <button className="join-button"><Link to='/signup' style={{textDecoration:'none',color:'white'}} >Join Now</Link></button>
      </div>
    </div>
  );
};

export default HeroBanner;
