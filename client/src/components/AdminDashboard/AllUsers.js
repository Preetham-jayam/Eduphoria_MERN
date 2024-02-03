import React from "react";
import "./AllUsers.css";
import { toast } from "react-toastify";

const AllUsers = ({ users }) => {
  const reloadPage = () => {
    window.location.reload();
  };

  const BlockUser = (user) => {
    fetch(`http://localhost:8000/user/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user, flag: 1 }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("User Blocked Succesfully");
        console.log("User blocked successfully", data);
        reloadPage();
      })
      .catch((error) => {
        console.error("Error blocking user:", error);
      });
  };

  const UnblockUser = (user) => {
    fetch(`http://localhost:8000/user/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user, flag: 0 }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("User UnBlocked Succesfully");
        console.log("User unblocked successfully", data);
        reloadPage();
      })
      .catch((error) => {
        console.error("Error unblocking user:", error);
      });
  };

  const DeleteUser = (user) => {
    fetch(`http://localhost:8000/user/${user.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("User Deleted Succesfully");
        console.log("User deleted successfully", data);
        reloadPage();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <div className="user-cards-container">
      {users.map((user) => (
        <div className="user-card" key={user.id}>
          {user.role === 0 && (
            <>
              <div className="user-details">
                <h3 className="user-name">
                  {user.firstName} {user.lastName}(Student)
                </h3>
                <p className="user-info"><strong>Phone No:</strong> {`${user.phoneNo}`}</p>
                <p className="user-info"><strong>Address </strong> {`${user.address}`}</p>

                <p className="user-info"><strong>Enrolled Courses :</strong></p>
                <ul className="user-courses">
                  {user.courses.map((course) => (
                    <li key={course.id} className="course-item">
                      {course.title}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="user-actions">
                {user.flag === 0 && (
                  <>
                    <button
                      className="action-button"
                      onClick={() => BlockUser(user)}
                    >
                      Block
                    </button>
                  </>
                )}
                {user.flag === 1 && (
                  <button
                    className="actionunblock"
                    onClick={() => UnblockUser(user)}
                  >
                    UnBlock
                  </button>
                )}
                <button
                  className="delete-button"
                  onClick={() => DeleteUser(user)}
                >
                  Delete
                </button>
              </div>
            </>
          )}

          {user.role === 1 && (
            <>
              <div className="user-details">
                <h3 className="user-name">{user.fullName}(Teacher)</h3>
                <p className="user-info"><strong>Phone No:</strong> {`${user.phoneNo}`}</p>
                <p className="user-info"><strong>Gender:</strong> {`${user.gender}`}</p>
                <p className="user-info"><strong>Teaching Courses :</strong></p>
                <ul className="user-courses">
                  {user.courses.map((course) => (
                    <li key={course.id} className="course-item">
                      {course.title}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="user-actions">
                {user.flag === 0 && (
                  <>
                    <button
                      className="action-button"
                      onClick={() => BlockUser(user)}
                    >
                      Block
                    </button>
                  </>
                )}
                {user.flag === 1 && (
                  <button
                    className="actionunblock"
                    onClick={() => UnblockUser(user)}
                  >
                    UnBlock
                  </button>
                )}
                <button
                  className="delete-button"
                  onClick={() => DeleteUser(user)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllUsers;
