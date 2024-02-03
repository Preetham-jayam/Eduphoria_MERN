import React from 'react';
import './Footer.css'; 
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/help">FAQ</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: eduphoriaiiits@gmail.com</p>
          <p>Phone: +91 9573569787</p>
        </div>
        </div>
        
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Eduphoria. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
