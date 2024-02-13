import React from 'react';
import './UserCard.css';


const UserCard = ({ user, onBlock, onUnBlock, onDelete }) => {

    const handleBlockClick = () => {
        onBlock(user._id);
    };

    const handleUnBlockClick = () => {
        onUnBlock(user._id);
    };

    const handleDeleteClick = () => {
        onDelete(user._id);
    };

    return (
        <div className="custom-user-card">
            <div className="custom-user-info">
                <img src={user.Imageurl} alt="User" className="custom-user-image" />
                <div className="custom-user-details">
                    {user.role === 0 && (
                        <>
                            <h2>{user.student.firstName + " " + user.student.lastName}</h2>
                            <br></br>
                            <h2>Student</h2>
                            <h4>Email : {user.email}</h4>
                            <h4>Phone Number: {user.student.phoneNo}</h4>
                            <h4>Date of birth: {user.student.dateofbirth}</h4>
                        </>
                    )}
                    {user.role === 1 && (
                        <>
                            <h2>{user.teacher.FullName}</h2>
                            <br></br>
                            <h2>Teacher</h2>
                            <h4>Email : {user.email}</h4>
                            <h4>Phone Number: {user.teacher.phoneNo}</h4>
                            <h4>Institution: {user.teacher.InstName}</h4>
                        </>
                    )}
                </div>
            </div>
            <div className="custom-user-actions">
              
                    <>
                        {user.flag === 0 && (
                            <button className="block" onClick={handleBlockClick}>Block</button>
                        )}
                        {user.flag === 1 && (
                            <button className="unblock" onClick={handleUnBlockClick}>Unblock</button>
                        )}
                        <button className="delete" onClick={handleDeleteClick}>Delete</button>
                    </>
                
            </div>
        </div>
    );
};

export default UserCard;
