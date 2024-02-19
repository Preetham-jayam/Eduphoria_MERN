import React, { useState, useEffect } from 'react';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../Slices/usersApiSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import './AccountEdit.css';

const AccountEdit = () => {
  const auth = useSelector((state) => state.auth);
  const userId = auth.userInfo?.userId;

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useGetUserDetailsQuery(auth.userInfo?.userId);

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updateUser, { isLoading, isError, error }] = useUpdateUserMutation();

  useEffect(() => {
    if (userData) {
      setEmail(userData.user.email);
    }
    if (userError) {
      console.log('Failed to fetch user details:', userError);
    }
  }, [userData, userError]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if(newPassword.length<8){
      toast.error('Password length must be atleast 8 characters');
    }

    try {
      const { data } = await updateUser({
        userId: userId,
        email: email,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      console.log(data);

      if (data) {
        toast.success(data.message);
        setEmail('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (userLoading) {
    return <Loader />;
  }

  return (
    <div className="edit-form-container">
      <h2>Edit User Profile</h2>
      <form onSubmit={handleUpdateUser}>
        <div className="edit-form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="edit-form-group">
          <div style={{position:'relative'}}>
          <label>Current Password:</label>
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <i
            className={`fa ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            style={{ cursor: "pointer", position: "absolute", right: "10px", top: "70%", transform: "translateY(-50%)" }}
          ></i>
          </div>
        </div>
        <div className="edit-form-group">
          <div style={{position:'relative'}}>
          <label>New Password:</label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <i
            className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowNewPassword(!showNewPassword)}
            style={{ cursor: "pointer", position: "absolute", right: "10px", top: "70%", transform: "translateY(-50%)" }}
          ></i>
          </div>
        </div>
        <div className="edit-form-group">
          <div style={{position:'realtive'}}>
            <label>Confirm New Password:</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <i
              className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: "pointer", position: "absolute",top:"60%",left:"60.5%" }}
            ></i>
          </div>
        </div>
        <div className="button-container">
          <button type="submit" disabled={isLoading}>
            Update
          </button>
        </div>
      </form>
      {isError && <div className="error-message">{error.message}</div>}
    </div>
  );
};

export default AccountEdit;
