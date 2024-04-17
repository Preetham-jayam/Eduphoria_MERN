import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetUserDetailsQuery } from "../../Slices/usersApiSlice";
import { useGetCourseDetailsQuery } from "../../Slices/courseApiSlice";
import { useEnrollCourseMutation } from "../../Slices/studentApiSlice";
import { toast } from 'react-toastify';
import Loader from "../Loader/Loader";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import './EnrollPayment.css';

const EnrollPayment = () => {
  const { cid } = useParams();
  const auth = useSelector((state) => state.auth);
  const { data: userData, isLoading: userLoading } = useGetUserDetailsQuery(auth.userInfo?.userId);
  const { data: courseData, isLoading: courseLoading } = useGetCourseDetailsQuery(cid);
  const [enrollCourse] = useEnrollCourseMutation();
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);

  const handleSuccess = async (details, data) => {
    try {
      await enrollCourse({ userId: userData.user.id, courseId: cid });
      toast.success("Course enrolled successfully", { autoClose: 3000 });
      navigate(`/courseContent/${cid}`);
    } catch (error) {
      console.error(error.message);
      toast.error("Error enrolling in the course", { autoClose: 3000 });
    }
  };

  const handleError = (err) => {
    console.error("An error occurred during PayPal checkout:", err);
    toast.error("Error during payment. Please try again.", { autoClose: 3000 });
  };

  if (userLoading || courseLoading || !userData || !courseData) {
    return <Loader />;
  }

  const createOrder = (data, actions) => {
    setShowSpinner(true);
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: courseData.course.title,
          amount: {
            currency_code: "USD",
            value: courseData.course.price,
          },
        },
      ],
    });
  };

  const onApprove = (data) => {
    setShowSpinner(false);
    handleSuccess(null, data);
  };

  return (
    <div className="enroll-payment-container">
    <h2>Enroll Course</h2>
    <div className="enroll-payment-form">
        <h3>Course: <span style={{ color: '#06bbcc' }}>{courseData.course.title}</span></h3>
        <h3>Instructor Name: <span style={{ color: '#06bbcc' }}>{courseData.course.instructorName}</span></h3>
        <h3>Price: <span style={{ color: 'red' }}>{courseData.course.price}</span></h3>
      <PayPalScriptProvider options={{ clientId: "AX-vMceEk8bWnS2CYWuTkilAtyx4TSiD6-VinlotsfKd0mIiTY_X1Ydy3sqBdVO0U9qvxfeOVlC2B_tm" }}>
        <ButtonWrapper createOrder={createOrder} onApprove={onApprove} showSpinner={showSpinner} onError={handleError} />
      </PayPalScriptProvider>
    </div>
  </div>
  
  );
};

const ButtonWrapper = ({ createOrder, onApprove, showSpinner, onError }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  console.log(isPending);
  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={createOrder}
        onApprove={(data) => onApprove(data)}
        onError={(err) => onError(err)}
        forceReRender={[showSpinner]}
      />
    </>
  );
};

export default EnrollPayment;