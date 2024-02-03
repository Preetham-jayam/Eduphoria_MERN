import React, { useState, useEffect } from "react";
import "./Profile.css";
import {useNavigate} from 'react-router-dom';
import Loader from "../Loader/Loader";
import EnrolledCourseList from "../Courses/EnrolledList";
import { useSelector } from "react-redux";
import Modal from "../../shared/components/FrontendTools/Modal";
import { useGetUserDetailsQuery } from "../../Slices/usersApiSlice";
import { useUpdateProfileMutation } from "../../Slices/studentApiSlice";
import {toast} from 'react-toastify';

const Profile = () => {
  
  const auth = useSelector((state) => state.auth);
  const navigate=useNavigate();
  const [updateProfile] = useUpdateProfileMutation();
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  const { data: userData, isLoading: userLoading, isError: userError } = useGetUserDetailsQuery(auth.userInfo?.userId);
  
  useEffect(() => {
    if (userData) {
      if(userData.user.role===0){
        setRole(userData.user.role);
        setUser(userData.user.student );
        setUserCourses(userData.user.student.courses);
        setEditedUser(userData.user.student);
        console.log(userData.user.student.firstName);
      }
      if(userData.user.role===1){
        setRole(userData.user.role);
        setUser(userData.user.teacher );
        setUserCourses(userData.user.teacher.courses);
      }
      if(userData.user.role===2){
        setUser(userData.user );
        
      }
    }
  },[userData]);

  useEffect(()=>{
    if(userError){
      console.log('Error fetching user details:',userError);
    }
  },[userError]);

  

  const openEditModal = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
  };

  const saveEditedUser = async () => {
    try {
      const response = await updateProfile({ studentId: editedUser._id, ...editedUser });
      
      if (response.error) {
        toast.error("Failed to update profile");
        console.error('Failed to update user:', response.error);
      } else {
        toast.success("Profile updated succesfully");
        console.log('User updated successfully:', response.data);
        setUser(response.data); 
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if(userLoading){
    return <Loader/>;
  }

  return (
    <>
      {role === 0 && (
        <>
          <div className="user-profile">
            <div className="user-details">
              <h1 className="user-name">User Profile</h1>
              <div className="user-info">
                <div className="info-item">
                  <span className="info-label">First Name:</span>
                  <span className="info-value">{user.firstName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Last Name:</span>
                  <span className="info-value">{user.lastName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number:</span>
                  <span className="info-value">{user.phoneNo}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date of Birth:</span>
                  <span className="info-value">{user.dateofbirth}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{user.address}</span>
                </div>
                <button onClick={openEditModal} className="edit-btn">
                  Edit Profile
                </button>

                <button onClick={()=>navigate('/profile/editaccount')} className="account-btn">
                  Edit Account
                </button>
              </div>

            </div>
          </div>

          <Modal
            show={isEditing}
            onCancel={closeEditModal}
            header="Edit Profile"
            footerClass="modal__footer-profile"
            footer={
              <React.Fragment>
                <button onClick={saveEditedUser} className="edit-btn">
                  Save
                </button>
                <button onClick={closeEditModal} className="logout-btn">
                  Cancel
                </button>
              </React.Fragment>
            }
          >
            <div className="profile-item">
              <span className="profile-label">First Name:</span>
              <input
                type="text"
                value={editedUser.firstName}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, firstName: e.target.value })
                }
              />
            </div>
            <div className="profile-item">
              <span className="profile-label">Last Name:</span>
              <input
                type="text"
                value={editedUser.lastName}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, lastName: e.target.value })
                }
              />
            </div>
            
            <div className="profile-item">
              <span className="profile-label">Phone Number:</span>
              <input
                type="text"
                value={editedUser.phoneNo}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, phoneNo: e.target.value })
                }
              />
            </div>
            <div className="profile-item">
              <span className="profile-label">Date of Birth:</span>
              <input
                type="text"
                value={editedUser.dateofbirth}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, dob: e.target.value })
                }
              />
            </div>
            <div className="profile-item">
              <span className="profile-label">Address:</span>
              <input
                type="text"
                value={editedUser.address}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, address: e.target.value })
                }
              />
            </div>
          </Modal>

          <div className="user-courses">
            {userLoading ? (
              <Loader />
            ) : (
              <EnrolledCourseList courses={userCourses} user={userData.user} role={role}/>
            )}
          </div>
        </>
      )}

      {role === 1 && (
        <>
          <div className="user-profile">
            <div className="user-details">
              <h1 className="user-name">Teacher Profile</h1>
              <div className="user-info">
                <div className="info-item">
                  <span className="info-label">Full Name:</span>
                  <span className="info-value">{user.fullName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Institute Name:</span>
                  <span className="info-value">{user.instituteName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number:</span>
                  <span className="info-value">{user.phoneNo}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">{user.gender}</span>
                </div>
                <button onClick={openEditModal} className="edit-btn">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          <Modal
            show={isEditing}
            onCancel={closeEditModal}
            header="Edit Profile"
            footerClass="modal__footer-profile"
            footer={
              <React.Fragment>
                <button onClick={saveEditedUser} className="edit-btn">
                  Save
                </button>
                <button onClick={closeEditModal} className="logout-btn">
                  Cancel
                </button>
              </React.Fragment>
            }
          >
            <div className="profile-item">
              <span className="profile-label">FullName:</span>
              <input
                type="text"
                value={editedUser.fullName}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, fullName: e.target.value })
                }
              />
            </div>
            <div className="profile-item">
              <span className="profile-label">Institute Name:</span>
              <input
                type="text"
                value={editedUser.instituteName}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    instituteName: e.target.value,
                  })
                }
              />
            </div>
            <div className="profile-item">
              <span className="profile-label">Email:</span>
              <input
                type="text"
                value={editedUser.email}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
              />
            </div>
            <div className="profile-item">
              <span className="profile-label">Phone Number:</span>
              <input
                type="text"
                value={editedUser.phoneNo}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, phoneNo: e.target.value })
                }
              />
            </div>
            <div className="profile-item">
              <span className="profile-label">Gender:</span>
              <input
                type="text"
                value={editedUser.gender}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, gender: e.target.value })
                }
              />
            </div>
          </Modal>
          <div className="user-courses">
            {userLoading ? (
              <Loader />
            ) : (
              <EnrolledCourseList courses={userCourses} />
            )}
          </div>
        </>
      )}

      {role === 2 && (
        <>
          <div className="user-profile">
            <div className="user-details">
              <h1 className="user-name">Admin Profile</h1>
              <div className="user-info">
                <div className="info-item">
                  <span className="info-label">Full Name:</span>
                  <span className="info-value">{user.fullName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Institute Name:</span>
                  <span className="info-value">{user.instituteName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number:</span>
                  <span className="info-value">{user.phoneNo}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender:</span>
                  <span className="info-value">{user.gender}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
