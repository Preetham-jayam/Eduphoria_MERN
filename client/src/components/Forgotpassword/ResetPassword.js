import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../Slices/usersApiSlice";
import { toast } from "react-toastify";
import Card from "../../shared/components/FrontendTools/Card";
import Button from "../../shared/components/FrontendTools/Button";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [resetPassword] = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPassword({ token, newPassword: password });
      setPassword("");
      setConfirmPassword("");
      toast.success(response.data.message);
      navigate("/signin");
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <Card>
        <h1 style={{ color: "#06bbcc", textDecorationLine: "underline" }}>
          Reset Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-input">
              <div style={{ position: "relative" }}>
                <label htmlFor="password">Password:</label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  onClick={togglePasswordVisibility}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    top: "70%",
                    transform: "translateY(-50%)",
                  }}
                ></i>
              </div>
            </div>
            <div className="form-input">
              <div style={{ position: "relative" }}>
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  id="confirmPassword"
                  type={confirmShowPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <i
                  className={`fa ${
                    confirmShowPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                  onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    top: "70%",
                    transform: "translateY(-50%)",
                  }}
                ></i>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
