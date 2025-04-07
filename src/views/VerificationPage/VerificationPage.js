import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate for redirection
import axios from "axios";
import "./VerificationPage.css";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // State to track verification status

  useEffect(() => {
    // console.log("Full location object:", location); // Debug: Log the entire location object
    const hash = location.hash || ''; // e.g., "#/VerifyEmail?token=1ff9c601-c9eb-46f9-a5f2-6046d2ed82ae"
    // console.log("Hash:", hash); // Debug: Check the raw hash

    // Extract the query string part after "?"
    const queryIndex = hash.indexOf("?");
    if (queryIndex !== -1) {
      const queryString = hash.substring(queryIndex + 1); // e.g., "token=1ff9c601-c9eb-46f9-a5f2-6046d2ed82ae"
      // console.log("QueryString:", queryString); // Debug: Check the query string

      const params = new URLSearchParams(queryString);
      const tokenParam = params.get("token");
      // console.log("Token from hash:", tokenParam); // Debug: Check the extracted token

      if (tokenParam) {
        setToken(tokenParam);
      }
    } else {
      // If no token in hash, check if it's in search (query params)
      const searchParams = new URLSearchParams(location.search);
      const tokenFromSearch = searchParams.get("token");
      // console.log("Token from search:", tokenFromSearch); // Debug: Check search params
      if (tokenFromSearch) {
        setToken(tokenFromSearch);
      }
    }
  }, [location]);

  const handleVerify = () => {
    if (!token) {
      // console.log("No token available to verify.");
      return;
    }

    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/auth/verify-email?token=${token}`)
      .then((response) => {
        // console.log("Email verified successfully:", response.data);
        setIsVerified(true); // Set verification status to true
        // Redirect to /login after a short delay (optional, for UX)
        setTimeout(() => navigate("/login"), 1000); // Redirect after 1 second
      })
      .catch((error) => {
        // console.error("Verification failed:", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="verification-wrapper">
      <div className="verification-card">
        <img src="/logo192.png" alt="Logo" className="logo" />
        <h2>Email Verification</h2>
        {token ? (
          <button
            className="login-button"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : isVerified
              ? "Login" // Change button text to "Login" after verification
              : "VERIFY EMAIL"}
          </button>
        ) : (
          <p>No token found in the URL.</p>
        )}
        {isVerified && <p>Email verified successfully! Redirecting to login...</p>}
      </div>
    </div>
  );
};

export default VerificationPage;