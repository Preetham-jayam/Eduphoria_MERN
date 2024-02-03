import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import "./Signup.css";
import Card from "../../shared/components/FrontendTools/Card";
import { toast } from "react-toastify";
import Cuspinner from "../Loader/Loader.js";
import { useRegisterMutation } from "../../Slices/usersApiSlice.js";
const SignUp = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNoError, setPhoneNoError] = useState("");
  const [dobError, setDobError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const enrolledCourses = [];
  const completedLessons = [];
  const role = 0;
  const flag = 0;

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setFirstNameError("");
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setLastNameError("");
  };

  const handlePhoneNoChange = (e) => {
    setPhoneNo(e.target.value);
    setPhoneNoError("");
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);
    setDobError("");
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setAddressError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFirstNameError("");
    setLastNameError("");
    setPhoneNoError("");
    setDobError("");
    setAddressError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!firstName) {
      setFirstNameError("First Name is required");
      isValid = false;
    }

    if (!lastName) {
      setLastNameError("Last Name is required");
      isValid = false;
    }

    if (!phoneNo) {
      setPhoneNoError("Phone Number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneNo)) {
      setPhoneNoError("Phone Number must be 10 digits");
      isValid = false;
    }

    if (!dob) {
      setDobError("Date of Birth is required");
      isValid = false;
    }

    if (!address) {
      setAddressError("Address is required");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid Email Address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      let userObj = {
        firstName,
        lastName,
        phoneNo,
        dob,
        address,
        email,
        password,
        role,
        enrolledCourses,
        completedLessons,
        flag,
      };

      try {
        const res = await register(userObj).unwrap();
        console.log(res);
        toast.success("Registered Successfully");
        navigate("/signin");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="signup-container">
      {isLoading && <Cuspinner />}
      <Card>
        <h1 style={{ color: "#06bbcc", textDecorationLine: "underline" }}>
          Student Signup
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-input">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={firstName}
                onChange={handleFirstNameChange}
              />
              <div className="error-message">{firstNameError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={lastName}
                onChange={handleLastNameChange}
              />
              <div className="error-message">{lastNameError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="phoneNo">Phone Number:</label>
              <input
                type="text"
                name="phoneNo"
                id="phoneNo"
                value={phoneNo}
                onChange={handlePhoneNoChange}
              />
              <div className="error-message">{phoneNoError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="dob">Date of Birth:</label>
              <input
                type="date"
                name="dob"
                id="dob"
                value={dob}
                onChange={handleDobChange}
              />
              <div className="error-message">{dobError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={handleAddressChange}
              />
              <div className="error-message">{addressError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="email">Email Address:</label>
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
              <div className="error-message">{emailError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <div className="error-message">{passwordError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <div className="error-message">{confirmPasswordError}</div>
            </div>
            <div className="submitButtton">
              <button type="submit">Submit</button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
