import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EnrollPayment.css";
import { useSelector } from "react-redux";
import { useGetUserDetailsQuery } from "../../Slices/usersApiSlice";
import { useEnrollCourseMutation } from "../../Slices/studentApiSlice";
import {toast} from 'react-toastify';
import Loader from "../Loader/Loader";

const EnrollPayment = () => {
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);

  const { cid } = useParams();
  const { data, isLoading: userLoading } = useGetUserDetailsQuery(auth.userInfo?.userId);
  const [enrollCourse]=useEnrollCourseMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
   
  }, [data]);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!/^\d{16}$/.test(cardNumber)) {
      errors.cardNumber = "Invalid card number";
    }

    if (!/^\d{2}\/\d{4}$/.test(expiryDate)) {
      errors.expiryDate = "Invalid expiry date";
    }

    if (!/^\d{3}$/.test(cvv)) {
      errors.cvv = "Invalid CVV";
    }

    return errors;
  };

  const handlePayment = async () => {
    const formErrors = validateForm();
   
    if (Object.keys(formErrors).length === 0) {
      try {
        await enrollCourse({ userId: user.id, courseId: cid });

        toast.success("Course enrolled successfully", { autoClose: 3000 });
        
        navigate(`/courseContent/${cid}`);
      
      } catch (error) {
        console.error(error.message);
        toast.error("Error enrolling in the course", { autoClose: 3000 });
      }
    } else {
      setErrors(formErrors);
    }
  };

  if (userLoading ) {
    return <Loader />;
  }

  return (
    <div className="enroll-payment-container">
      <h2>Enrollment Payment Page</h2>
      <form className="enroll-payment-form">
        <label>
          Card Number:
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Enter your card number"
            className="enroll-input"
          />
          {errors.cardNumber && <span className="enroll-error">{errors.cardNumber}</span>}
        </label>
        <br />
        <label>
          Expiry Date:
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YYYY"
            className="enroll-input"
          />
          {errors.expiryDate && <span className="enroll-error">{errors.expiryDate}</span>}
        </label>
        <br />
        <label>
          CVV:
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="Enter CVV"
            className="enroll-input"
          />
          {errors.cvv && <span className="enroll-error">{errors.cvv}</span>}
        </label>
        <br />
        <button type="button" onClick={handlePayment} className="enroll-button">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default EnrollPayment;
