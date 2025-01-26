import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAuthentication } from "./LoginController";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/image.png";
import Logo from "../../assets/logo.png";
import GoogleSvg from "../../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState(""); // State for general error messages
  const { loading, error, isUserValid } = useSelector((state) => state.userAuthentication); // Access loading and error state from Redux

  useEffect(() => {
    if (isUserValid) {
      navigate("/vote"); // Redirect to the vote page after successful login
    }
  }, [isUserValid, navigate]);

  const onChangeHandler = (event) => {
    const { id, value } = event.target;
    setUserDetails({ ...userDetails, [id]: value });
    if (id === "email") setEmailError("");
    if (id === "password") setPasswordError("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      userVerification();
    }
  };

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

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

    if (!userDetails.password) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    return isValid;
  };

  const userVerification = () => {
    if (validate()) {
      dispatch(getUserAuthentication(userDetails)).then((response) => {
        if (response.payload && response.payload.message === "Login successful!") {
          sessionStorage.setItem('userId', response.payload.userId); // Store user ID in session storage
          navigate("/vote");
        } else if (response.error) {
          setGeneralError("Invalid email or password. Please try again.");
        }
      });
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Login Illustration" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form>
              {generalError && <div className="error-message">{generalError}</div>} {/* Display general error message */}
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
              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" disabled={loading} />
                  <label htmlFor="remember-checkbox">Remember for 30 days</label>
                </div>
                <a href="#" className="forgot-pass-link">Forgot password?</a>
              </div>
              <div className="login-center-buttons">
                <button type="button" onClick={userVerification} disabled={loading}>
                  {loading ? "Loading..." : "Log In"}
                </button>
                <button type="button" disabled={loading}>
                  <img src={GoogleSvg} alt="Google Logo" /> Log In with Google
                </button>
              </div>
            </form>
          </div>
          <p className="login-bottom-p">
            Don't have an account? <a onClick={() => navigate("/signup")} disabled={loading}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
