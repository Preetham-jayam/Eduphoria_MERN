import React, { useState } from 'react';
import Modal from '../../shared/components/FrontendTools/Modal';
import Button from '../../shared/components/FrontendTools/Button';

const CourseCard = ({ course, onDeleteCourse }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteCourse(course._id);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="course-card"
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <img src={`${course.Imageurl}`} alt={course.title} className="course-image" />
      <div className="course-info">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-price">₹{course.price}</p>
        <p className="course-instructor">
          <b>Instructor</b>: {course.instructorName}
        </p>
        <p className="course-students">
          <b>Enrolled Students</b>: {course.students.length}
        </p>
        
        <Button
          danger
          className="delete-course"
          onClick={handleDeleteClick}
        >
         Delete
        </Button>
      
      </div>
      <Modal
        show={isModalOpen}
        onCancel={handleCloseModal}
        header="Confirmation"
        footer={
          <React.Fragment>
            <Button danger onClick={handleConfirmDelete}>Delete</Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </React.Fragment>
        }
      >
        <h4>Are you sure you want to delete the course {course.title}?</h4>
      </Modal>
    </div>
  );
};

export default CourseCard;
