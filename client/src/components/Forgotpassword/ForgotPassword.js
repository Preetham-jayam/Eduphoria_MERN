import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import { useForgotPasswordMutation } from "../../Slices/usersApiSlice";
import { toast } from "react-toastify";
import Card from "../../shared/components/FrontendTools/Card";
import Button from "../../shared/components/FrontendTools/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [forgotPassword] = useForgotPasswordMutation();

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    
    if (!email) {
      setEmailError("Email is required");
      return;
    }
  
    try {
        setIsLoading(true);
        const response = await forgotPassword(email); 
        setEmailSent(true);
        toast.success(response.data.message || "Email sent successfully");
        setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.data?.message || "Failed to send reset link");
    }
  };
  
  return (
    <div className="signup-container">
    <Card>
    <h1 style={{ color: "#06bbcc", textDecorationLine: "underline" }}>
         Forgot Password
        </h1>
      {!emailSent ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-input">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={emailChangeHandler}
            />
            <div className="error-message">{emailError}</div>
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      ) : (
        <p>
          An email has been sent to <b>{email}</b>. Follow the instructions in the
          email to reset your password.
        </p>
      )}
      <div className="back-to-login">
        <Link to="/signin">Back to Login</Link>
      </div>
    </Card>
    </div>
  );
};

export default ForgotPassword;
