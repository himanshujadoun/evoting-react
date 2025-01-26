import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "./signupController"; // Import the signup action
import { useNavigate } from "react-router-dom";
import Image from "../../assets/image.png";
import Logo from "../../assets/logo.png";
import GoogleSvg from "../../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignUp.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ fullName: "", email: "", aadhar: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState(""); // State for general error messages
  const loading = useSelector((state) => state.userSignUp.loading); // Access loading state from Redux

  const onChangeHandler = (event) => {
    const { id, value } = event.target;
    setUserDetails({ ...userDetails, [id]: value });
    if (id === "fullName") setFullNameError("");
    if (id === "email") setEmailError("");
    if (id === "aadhar") setAadharError("");
    if (id === "password") setPasswordError("");
    if (id === "confirmPassword") setConfirmPasswordError("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      userVerification();
    }
  };

  const validate = () => {
    let isValid = true;
    setFullNameError("");
    setEmailError("");
    setAadharError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!userDetails.fullName) {
      setFullNameError("Full Name is required.");
      isValid = false;
    }

    if (!userDetails.email) {
      setEmailError("Email is required.");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userDetails.email)) {
        setEmailError("Invalid email format.");
        isValid = false;
      }
    }

    if (!userDetails.aadhar) {
      setAadharError("Aadhar Card Number is required.");
      isValid = false;
    } else {
      const aadharRegex = /^\d{12}$/;
      if (!aadharRegex.test(userDetails.aadhar)) {
        setAadharError("Invalid Aadhar Card Number format.");
        isValid = false;
      }
    }

    if (!userDetails.password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (userDetails.password !== userDetails.confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    return isValid;
  };

  const userVerification = () => {
    if (validate()) {
      dispatch(signUpUser(userDetails)).then((response) => {
        if (response.payload && response.payload.message === "Signup successful! Please verify your email.") {
          navigate("/login");
        } else if (response.payload && response.payload.message === "User already exists. Please log in.") {
          setGeneralError("User already exists. Please log in.");
        } else if (response.error) {
          setGeneralError("Signup failed. Please try again.");
        }
      });
    }
  };

  return (
    <div className="signup-main">
      <div className="signup-left">
        <img src={Image} alt="Signup Illustration" />
      </div>
      <div className="signup-right">
        <div className="signup-right-container">
          <div className="signup-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="signup-center">
            <h2>Join us!</h2>
            <p>Please fill up your details</p>
            <form>
              {generalError && <div className="error-message">{generalError}</div>} {/* Display general error message */}
              <input
                type="text"
                placeholder="Full Name"
                id="fullName"
                value={userDetails.fullName}
                onChange={onChangeHandler}
                onKeyPress={handleKeyPress}
                className={`form-control ${fullNameError ? "is-invalid" : ""}`}
                disabled={loading} // Disable input while loading
              />
              {fullNameError && <div className="error-message">{fullNameError}</div>}
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={userDetails.email}
                onChange={onChangeHandler}
                onKeyPress={handleKeyPress}
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                disabled={loading} // Disable input while loading
              />
              {emailError && <div className="error-message">{emailError}</div>}
              <input
                type="text"
                placeholder="Aadhar Card Number"
                id="aadhar"
                value={userDetails.aadhar}
                onChange={onChangeHandler}
                onKeyPress={handleKeyPress}
                className={`form-control ${aadharError ? "is-invalid" : ""}`}
                disabled={loading} // Disable input while loading
              />
              {aadharError && <div className="error-message">{aadharError}</div>}
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  value={userDetails.password}
                  onChange={onChangeHandler}
                  onKeyPress={handleKeyPress}
                  className={`form-control ${passwordError ? "is-invalid" : ""}`}
                  disabled={loading} // Disable input while loading
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => { setShowPassword(!showPassword) }} />
                ) : (
                  <FaEye onClick={() => { setShowPassword(!showPassword) }} />
                )}
              </div>
              {passwordError && <div className="error-message">{passwordError}</div>}
              <div className="pass-input-div">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  id="confirmPassword"
                  value={userDetails.confirmPassword}
                  onChange={onChangeHandler}
                  onKeyPress={handleKeyPress}
                  className={`form-control ${confirmPasswordError ? "is-invalid" : ""}`}
                  disabled={loading} // Disable input while loading
                />
                {showConfirmPassword ? (
                  <FaEyeSlash onClick={() => { setShowConfirmPassword(!showConfirmPassword) }} />
                ) : (
                  <FaEye onClick={() => { setShowConfirmPassword(!showConfirmPassword) }} />
                )}
              </div>
              {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
              <div className="signup-center-buttons">
                <button type="button" onClick={userVerification} disabled={loading}>
                  {loading ? "Loading..." : "Sign Up"}
                </button>
                <button type="button" disabled={loading}>
                  <img src={GoogleSvg} alt="Google Logo" /> Sign Up with Google
                </button>
              </div>
            </form>
          </div>
          <p className="signup-bottom-p">
            Already have an account? <a onClick={() => navigate("/login")} disabled={loading}>Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
