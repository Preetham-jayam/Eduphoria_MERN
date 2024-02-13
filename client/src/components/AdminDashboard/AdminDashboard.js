import React, { useState, useEffect } from "react";
import {
  useGetPendingTeachersQuery,
  useAcceptTeacherMutation,
  useDeclineTeacherMutation,
  useBlockUserMutation,
  useDeleteUserMutation,
} from "../../Slices/adminApiSlice";
import { useGetUsersQuery } from "../../Slices/usersApiSlice";
import "./Admindashboard.css";
import { toast } from "react-toastify";
import TeacherCard from "./TeacherCard";
import UserCard from "./UserCard";
import Loader from "../Loader/Loader";

function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const {
    data: pendingTeachers,
    error: pendingTeachersError,
    isLoading: pendingTeachersLoading,
  } = useGetPendingTeachersQuery();
  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useGetUsersQuery();
  const [acceptTeacher] = useAcceptTeacherMutation();
  const [declineTeacher] = useDeclineTeacherMutation();
  const [blockUser] = useBlockUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    if (pendingTeachers) {
      setPendingInstructors(pendingTeachers.teachers);
    }
  }, [pendingTeachers]);

  useEffect(() => {
    if (users) {
      setAllUsers(users.users);
    }
  }, [users]);

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const handleAcceptTeacher = async (teacherId) => {
    try {
      await acceptTeacher(teacherId).unwrap();
      toast.success("Teacher accepted successfully");
    } catch (error) {
      toast.error("Failed to accept teacher");
    }
  };

  const handleDeclineTeacher = async (teacherId) => {
    try {
      const response = await declineTeacher(teacherId).unwrap();
      console.log("Decline Teacher Response:", response);
      toast.success("Teacher declined successfully");
    } catch (error) {
      console.error("Decline Teacher Error:", error);
      toast.error("Failed to decline teacher");
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await blockUser(userId).unwrap();
      toast.success("User blocked successfully");
      refetchUsers(); 
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleUnBlockUser = async (userId) => {
    try {
      await blockUser(userId).unwrap();
      toast.success("User UnBlocked successfully");
      refetchUsers(); 
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
        refetchUsers();
        
    } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user");
    }
};


  const TabPanel = ({ children, index }) => {
    return (
      <div className={`tabpanel ${selectedTab === index ? "active" : ""}`}>
        {children}
      </div>
    );
  };

  return (
    <div className="admindash">
      <div className="appbar">
        <div
          className={`tab ${selectedTab === 0 ? "active" : ""}`}
          onClick={() => handleTabChange(0)}
        >
          Manage Users
        </div>
        <div
          className={`tab ${selectedTab === 1 ? "active" : ""}`}
          onClick={() => handleTabChange(1)}
        >
          Manage Courses
        </div>
        <div
          className={`tab ${selectedTab === 2 ? "active" : ""}`}
          onClick={() => handleTabChange(2)}
        >
          Approve Teachers
        </div>
      </div>

      <div className="dash-container">
        <TabPanel index={0}>
          <h2>Manage Users</h2>
          {usersLoading && <Loader />}
          <div className="custom-user-card-container">
            {allUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onBlock={handleBlockUser}
                onDelete={handleDeleteUser}
                onUnBlock={handleUnBlockUser}
              />
            ))}
          </div>
        </TabPanel>
        <TabPanel index={1}>
          <h2>Manage Courses</h2>
        </TabPanel>
        <TabPanel index={2}>
          <h2>Approve Teachers</h2>
          {pendingTeachersLoading && <p>Loading...</p>}
          {pendingTeachersError && <p>Error: {pendingTeachersError.message}</p>}
          {pendingInstructors.length === 0 && <h4>No pending instructors</h4>}
          {pendingInstructors.map((teacher) => (
            <TeacherCard
              key={teacher._id}
              teacher={teacher}
              onAccept={handleAcceptTeacher}
              onDecline={handleDeclineTeacher}
            />
          ))}
        </TabPanel>
      </div>
    </div>
  );
}

export default AdminDashboard;
