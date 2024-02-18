import React, { useState } from 'react';
import Modal from '../../shared/components/FrontendTools/Modal'; 
import Button from '../../shared/components/FrontendTools/Button';
import './UserCard.css';

const UserCard = ({ user, onBlock, onUnBlock, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const handleBlockClick = () => {
    setIsModalOpen(true);
    setActionType('block');
  };

  const handleUnBlockClick = () => {
    setIsModalOpen(true);
    setActionType('unblock');
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
    setActionType('delete');
  };

  const handleConfirmAction = () => {
    if (actionType === 'block') {
      onBlock(user._id);
    } else if (actionType === 'unblock') {
      onUnBlock(user._id);
    } else if (actionType === 'delete') {
      onDelete(user._id);
    }
    setIsModalOpen(false);
    setActionType(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActionType(null);
  };

  return (
    <div className="custom-user-card">
      <div className="custom-user-info">
        <img src={user.Imageurl} alt="User" className="custom-user-image" />
        <div className="custom-user-details">
          {user.role === 0 && (
            <>
              <h2>{user.student.firstName + " " + user.student.lastName}</h2>
              <h4>Student</h4>
              <p>Email: {user.email}</p>
              <p>Phone Number: {user.student.phoneNo}</p>
              <p>Date of Birth: {user.student.dateofbirth}</p>
            </>
          )}
          {user.role === 1 && (
            <>
              <h2>{user.teacher.FullName}</h2>
              <h4>Teacher</h4>
              <p>Email: {user.email}</p>
              <p>Phone Number: {user.teacher.phoneNo}</p>
              <p>Institution: {user.teacher.InstName}</p>
            </>
          )}
        </div>
      </div>
      <div className="custom-user-actions">
        <>
          {user.flag === 0 && (
            <Button type='button' className="block"  onClick={handleBlockClick}>Block</Button>
          )}
          {user.flag === 1 && (
            <Button type='button' className="unblock" unblock onClick={handleUnBlockClick}>Unblock</Button>
          )}
          <Button type='button' className="delete" danger onClick={handleDeleteClick}>Delete</Button>
        </>
      </div>
      <Modal
        show={isModalOpen}
        onCancel={handleCloseModal}
        header="Confirmation"
        footer={
          <React.Fragment>
            <Button type='button' danger onClick={handleConfirmAction}>{actionType}</Button>
            <Button type='button' onClick={handleCloseModal}>Cancel</Button>
          </React.Fragment>
        }
      >
        <p>Are you sure you want to {actionType} this user?</p>
      </Modal>
    </div>
  );
};

export default UserCard;
