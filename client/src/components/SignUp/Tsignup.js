import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import Card from "../../shared/components/FrontendTools/Card";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../Slices/usersApiSlice.js";
const Tsignup = () => {
  const [register]=useRegisterMutation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [gender, setGender] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneNoError, setPhoneNoError] = useState("");
  const [instituteNameError, setInstituteNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const teachingCourses=[];
  const completedLessons=[];
  const role=1;
  const flag=0;
  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    setFullNameError("");
  };

  const handlePhoneNoChange = (e) => {
    setPhoneNo(e.target.value);
    setPhoneNoError("");
  };

  const handleInstituteNameChange = (e) => {
    setInstituteName(e.target.value);
    setInstituteNameError("");
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setGenderError("");
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

    setFullNameError("");
    setPhoneNoError("");
    setInstituteNameError("");
    setGenderError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    if (!fullName) {
      setFullNameError("Full Name is required");
      isValid = false;
    }

    if (!phoneNo) {
      setPhoneNoError("Phone Number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneNo)) {
      setPhoneNoError("Phone Number must be 10 digits");
      isValid = false;
    }

    if (!instituteName) {
      setInstituteNameError("Institute Name is required");
      isValid = false;
    }

    if (!gender) {
      setGenderError("Please select a gender");
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
        fullName,
        phoneNo,
        instituteName,
        gender,
        email,
        password,
        role,
        teachingCourses,
        completedLessons,
        flag
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
      <Card>
        <h1 style={{ color: "#06bbcc", textDecorationLine: "underline" }}>
          Teacher Signup
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-input">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={fullName}
                onChange={handleFullNameChange}
              />
              <div className="error-message">{fullNameError}</div>
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
              <label htmlFor="instituteName">Institute Name:</label>
              <input
                type="text"
                name="instituteName"
                id="instituteName"
                value={instituteName}
                onChange={handleInstituteNameChange}
              />
              <div className="error-message">{instituteNameError}</div>
            </div>
            <div className="form-input">
              <label htmlFor="gender" className="gender-label">
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={handleGenderChange}
                className="gender-select"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <div className="error-message">{genderError}</div>
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
            
          </div>
          <div className="submitButtton">
              <button type="submit">Submit</button>
            </div>
        </form>
      </Card>
    </div>
  );
};

export default Tsignup;
