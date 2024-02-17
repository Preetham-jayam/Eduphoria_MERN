import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "../../Slices/usersApiSlice";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { useAdminAddCourseMutation } from "../../Slices/adminApiSlice";
import Card from "../../shared/components/FrontendTools/Card";
const AdminAddCourse = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    name: "",
    image: null,
    titleError: "",
    descriptionError: "",
    priceError: "",
    nameError: ""
  });

  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const [addCourse] = useAdminAddCourseMutation();

  useEffect(() => {
    if (users) {
      const teacherUsers = users.users.filter((user) => user.role === 1).map((user)=>user.teacher);
      setTeachers(teacherUsers);
    }
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const validateForm = () => {
    let valid = true;
    const { title, description, price, name } = formData;

    if (!title.trim()) {
      setFormData((prev) => ({ ...prev, titleError: "Title is required" }));
      valid = false;
    }

    if (!description.trim()) {
      setFormData((prev) => ({ ...prev, descriptionError: "Description is required" }));
      valid = false;
    }

    if (!price.trim()) {
      setFormData((prev) => ({ ...prev, priceError: "Price is required" }));
      valid = false;
    }

    if (!name.trim()) {
      setFormData((prev) => ({ ...prev, nameError: "Name is required" }));
      valid = false;
    }

    return valid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("instructorName", formData.instructorName);
      formDataToSend.append("teacher", selectedTeacher._id);
      formDataToSend.append("image", formData.image);

      await addCourse(formDataToSend).unwrap();
      toast.success("Added Course Successfully!");
    } catch (error) {
      console.error("Failed to Add course:", error);
      toast.error("Failed to Add course");
    }
  };

  if (usersLoading) {
    return <Loader />;
  }

  return (
    <div className="signup-container">
        <Card>
      <h1>Add New Course</h1>
      <form onSubmit={submitHandler} encType="multipart/form-data">
      <div className="form-group">
        <div className="form-input">
          <label htmlFor="title">Title of Course:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
          />
          <div className="error-message">{formData.titleError}</div>
        </div>
        <div className="form-input">
          <label htmlFor="name">Name of Course:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
          <div className="error-message">{formData.nameError}</div>
        </div>
        <div className="form-input">
          <label htmlFor="description">Description of Course:</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={formData.description}
            rows={4}
            onChange={handleChange}
          />
          <div className="error-message">{formData.descriptionError}</div>
        </div>
        <div className="form-input">
          <label htmlFor="price">Price of Course:</label>
          <input
            type="text"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
          />
          <div className="error-message">{formData.priceError}</div>
        </div>

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

        <div className="form-input">
          <label htmlFor="file">Select Course Image:</label>
          <input
            type="file"
            name="image"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="submitButtton">
        <button type="submit" onClick={submitHandler}>
          Submit
        </button>
      </div>
      </form>
    </Card>
    </div>
  );
};

export default AdminAddCourse;
