import React from 'react';
import './TeacherCard.css';

const TeacherCard = ({ teacher, onAccept, onDecline }) => {
  return (
    <div className="teacher-card">
      <div className="teacher-info">
        <img src={teacher.Imageurl} alt="Teacher" className="teacher-image" />
        <div className="teacher-details">
          <h2>{teacher.teacher.FullName}</h2>
          <p>Email: {teacher.email}</p>
          <p>Institution: {teacher.teacher.InstName}</p>
          <p>Phone: {teacher.teacher.phoneNo}</p>
        </div>
      </div>
      
      <div className="teacher-actions">
        <button onClick={() => onAccept(teacher.teacher._id)}>Accept</button>
        <button onClick={() => onDecline(teacher.teacher._id)}>Decline</button>
      </div>
    </div>
  );
};

export default TeacherCard;
