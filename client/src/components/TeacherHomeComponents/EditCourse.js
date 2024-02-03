import React, { useEffect, useState } from "react";
import Card from "../../shared/components/FrontendTools/Card";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateCourse } from "../../Actions/CourseActions";
import { useDispatch } from "react-redux";
const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [course,setCourse]=useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    const getCourse = () => {
      fetch(`http://localhost:8000/courses/${id}`)
        .then((res) => {
          return res.json();
        })
        .then((course) => {
          setCourse(course);
          setTitle(course.title);
          setDescription(course.description);
          setPrice(course.price);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    getCourse();
  }, [id]);

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

  

  const submitHandler = (e) => {
  e.preventDefault();
  setTitleError("");
  setDescriptionError("");
  setPriceError("");

  let isValid = true;

  if (!title) {
    setTitleError("Title is required");
    isValid = false;
  }
  if (!description) {
    setDescriptionError("Description is required");
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

  let courseObj = {...course,
    title,
    description,
    price
  };

  if (isValid) {
    dispatch(updateCourse(id, courseObj))
      .then(() => {
        toast.success('Course Updated Successfully');
        navigate('/courseContent/' + id);
      })
      .catch((error) => {
        toast.error('Failed to update course: ' + error.message);
      });
  }
};


  return (
    <div className="signup-container">
      <Card>
        <h1>Edit Course</h1>
        <form onSubmit={submitHandler}>
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
          </div>

          <div className="submitButtton">
            <button type="submit">Edit Course</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditCourse;
