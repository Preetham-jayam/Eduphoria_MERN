import React, { useState, useEffect } from "react";
import Card from "../../shared/components/FrontendTools/Card";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddCourseMutation } from "../../Slices/teacherApiSlice";
import { useGetUserDetailsQuery,useGetUsersQuery } from "../../Slices/usersApiSlice";
import Loader from "../Loader/Loader";

const AddCourse = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [addCourse, { isLoading }] = useAddCourseMutation();
  const { data: user, isLoading: userLoading } = useGetUserDetailsQuery(
    auth.userInfo?.userId
  );

  const {
    data: users,
    isLoading: usersLoading,
  } = useGetUsersQuery();
  const [teachers, setTeachers] = useState([]);
  

  useEffect(() => {
    if (users) {
      const teacherUsers = users.users.filter((user) => user.role === 1).map((user)=>user.teacher);
      setTeachers(teacherUsers);
    }
  }, [users]);

  let chapters = [];
  let enrolledStudents = [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(""); 

  const titleChangeHandler = (e) => {
    setTitle(e.target.value);
    setTitleError("");
  };

  const priceChangeHandler = (e) => {
    setPrice(e.target.value);
    setPriceError("");
  };

  const descriptionChangeHandler = (e) => {
    setDescription(e.target.value);
    setDescriptionError("");
  };

  const nameChangeHandler = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  const fileChangeHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setTitleError("");
    setDescriptionError("");
    setPriceError("");
    setNameError("");

    let isValid = true;

    if (!title) {
      setTitleError("Title is required");
      isValid = false;
    }
    if (!description) {
      setDescriptionError("Description is required");
      isValid = false;
    }

    if (!name) {
      setNameError("Name is required");
      isValid = false;
    }
    if (!price) {
      setPriceError("Price is required");
      isValid = false;
    } else if (!/^\d+$/.test(price)) {
      setPriceError("Price must be in digits");
      isValid = false;
    } else if (price > 10000) {
      setPriceError("Price is Too Large. Decrease the value");
      isValid = false;
    }

    let formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("name", name);
    formData.append("teacher", auth.userInfo.role === 1 ? user.user.teacher._id : selectedTeacher._id); // Change logic based on user role
    formData.append("chapters", JSON.stringify(chapters));
    formData.append("enrolledStudents", JSON.stringify(enrolledStudents));
    formData.append("instructorName",auth.userInfo.role===1? user.user.teacher.FullName:selectedTeacher.FullName);

    if (isValid) {
      try {
        const { data, error } = await addCourse(formData);

        if (error) {
          if (error.status === 403) {
            toast.error("Authentication failed!");
          } else {
            toast.error("Failed to add course: " + error.message);
          }
        } else {
          console.log(data);
          toast.success("Course Added Successfully");
          navigate("/");
        }
      } catch (error) {
        toast.error("Failed to add course: " + error.message);
      }
    }
  };

  if (userLoading || usersLoading) {
    return <Loader />;
  }

  return (
    <div className="signup-container">
      <Card>
        {userLoading && <Loader />}
        <h1>Add New Course</h1>
        <form onSubmit={submitHandler} encType="multipart/form-data">
          <div className="form-group">
            <div className="form-input">
              <label htmlFor="title">Title of Course:</label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={titleChangeHandler}
              />
              <div className="error-message">{titleError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="name">Name of Course:</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={nameChangeHandler}
              />
              <div className="error-message">{nameError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="description">Description of Course:</label>
              <textarea
                type="text"
                name="description"
                id="description"
                value={description}
                rows={4}
                onChange={descriptionChangeHandler}
              />
              <div className="error-message">{descriptionError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="price">Price of Course:</label>
              <input
                type="text"
                name="price"
                id="price"
                value={price}
                onChange={priceChangeHandler}
              />
              <div className="error-message">{priceError}</div>
            </div>
            {auth.userInfo.role !== 1 && ( 
              <div className="form-input select-container">
              <label htmlFor="teacher">Select Teacher:</label>
              <select
                name="teacher"
                id="teacher"
                value={selectedTeacher ? selectedTeacher._id : ""}
                onChange={(e) => {
                  const selectedTeacherObject = teachers.find(
                    (teacher) => teacher._id === e.target.value
                  );
                  setSelectedTeacher(selectedTeacherObject);
                }}
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.FullName}
                  </option>
                ))}
              </select>
            </div>
            
            )}
            <div className="form-input">
              <label htmlFor="file">Select Course Image:</label>
              <input
                type="file"
                name="image"
                id="file"
                accept="image/*"
                onChange={fileChangeHandler}
              />
            </div>
          </div>

          <div className="submitButtton">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Adding Course..." : "Add Course"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCourse;
