import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useDispatch } from "react-redux";
import Card from "../../shared/components/FrontendTools/Card";
import loginPic from "../../Assets/login.png";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../Slices/usersApiSlice";
import { setCredentials,fetchUserData } from "../../Slices/authenticationSlice";
const Login = () => {
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const [login,{isLoading} ]=useLoginMutation();
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const PasswordChangeHandler = (e) => {
    setPassword(e.target.value);
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if(isValid){
      try {
        const res=await login({email,password}).unwrap();
        dispatch(setCredentials({...res,}));
        dispatch(fetchUserData(res.userId));
        navigate('/');
        
    } catch (err) {
        toast.error(err?.data?.message || err.error);
    }

    }

    
  };

  return (
    <div className="login-container">
      
      <Card>
        <h1 style={{ color: "#06bbcc", textDecorationLine: "underline" }}>
          Login Form
        </h1>
        <div className="image-container">
          <img src={loginPic} alt="login" className="login-image" />
        </div>
        <form onSubmit={SubmitHandler}>
          <div className="form-group">
            <div className="form-input">
              <label htmlFor="email">Email Address:</label>
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={emailChangeHandler}
                autoComplete="off"
              />
              <div className="error-message">{emailError}</div>
            </div>
            <div className="form-input">
              <div style={{position:'relative'}}>
              <label htmlFor="password">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={PasswordChangeHandler}
              />
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer", position: "absolute", right: "10px", top: "70%", transform: "translateY(-50%)" }}
              ></i>
              </div>
              <div className="error-message">{passwordError}</div>
            </div>
            <div className="submitBtn">
              <button type="submit" >
                 {isLoading ? 'Logging In' : 'Login'}
              </button>
            </div>
            <div className="signup-link">
              <span>Don't have an account?</span>{" "}
              <Link to="/signup">Sign Up</Link>
            </div>

            <div className="signup-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
