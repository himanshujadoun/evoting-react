import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerificationPage.css";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");

    if (!token || !email) {
      navigate("/login"); // Redirect to login if token or email is missing
      return;
    }

    axios.get(`http://localhost:5000/verify-email?token=${token}&email=${email}`)
      .then(response => {
        setMessage("Email verified successfully! You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Redirect to login page after 3 seconds
      })
      .catch(error => {
        setMessage("Verification failed. Invalid or expired token.");
      });
  }, [location, navigate]);

  return (
    <div className="verification-main">
      <div className="verification-container">
        <h2>Email Verification</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default VerificationPage;
