import React, { useEffect, useState } from "react";
import Card from "../../shared/components/FrontendTools/Card";
import { useGetCourseDetailsQuery } from "../../Slices/courseApiSlice";
import { useUpdateCourseMutation } from "../../Slices/teacherApiSlice";
import { useGetUserDetailsQuery } from "../../Slices/usersApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { data: user, isLoading: userLoading } = useGetUserDetailsQuery(
    auth.userInfo?.userId
  );
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();
  const { data, isLoading: courseLoading, isError: courseError } = useGetCourseDetailsQuery(id);
  const [name,setName]=useState("");
  const [course, setCourse] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [nameError,setNameError]=useState("");

  useEffect(() => {
    if (data) {
      console.log(data.course.Imageurl);
      setName(data.course.name);
      setCourse(data.course);
      setTitle(data.course.title);
      setDescription(data.course.description);
      setPrice(data.course.price);
    }

    if (courseError) {
      console.error("Error fetching courses:", courseError);
    }
  }, [data, courseError]);

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

  const nameChangeHandler=(e)=>{
    setName(e.target.value);
    setNameError("");
  }

  const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setTitleError("");
    setDescriptionError("");
    setPriceError("");
    setImageError("");
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
    if(!name){
      setNameError("Name is required");
      isValid=false;
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
   


    if (isValid) {
      try {
        const formData = new FormData();
        formData.append("courseId",id);
        formData.append("image", image);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("teacher", user.user.teacher._id );
        formData.append("price", price);
        formData.append("name", name); 
        formData.append("instructorName", course.instructorName); 
        formData.append("Imageurl",course.ImageUrl);  

        const { data, error } = await updateCourse({data:formData,courseId:id}).unwrap();

        if (error) {
          if (error.status === 403) {
            toast.error("Authentication failed!");
          } else {
            toast.error("Failed to update course: " + error.message);
          }
        } else {
          console.log(data);
          toast.success("Course Updated Successfully");
          navigate("/courseContent/" + id);
        }
      } catch (error) {
        toast.error(error?.data?.message);
      }
    }
  };

  if (courseLoading || userLoading) {
    return <Loader />;
  }

  return (
    <div className="signup-container">
      <Card>
        <h1>Edit Course</h1>
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
            <div className="form-input">
                  {data.course.Imageurl && (
                      <img
                          src={data.course.Imageurl}
                          alt={`Previous pic for ${data.course.title}`}
                          style={{ width: '200px', height: 'auto', display: 'block' }}
                      />
                  )}
                  <label htmlFor="image">Course Image:</label>
                  <input
                      type="file"
                      name="image"
                      id="image"
                      accept="image/*"
                      onChange={imageChangeHandler}
                  />
                  <div className="error-message">{imageError}</div>
              </div>

            <div className="form-input">
              <label htmlFor="instructorName">Instructor Name:</label>
              <input
                type="text"
                name="instructorName"
                id="instructorName"
                value={course.instructorName}
                disabled 
              />
            </div>
          </div>

          <div className="submitButtton">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Updating Course..." : "Edit Course"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditCourse;
