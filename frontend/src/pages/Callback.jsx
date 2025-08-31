import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/userSlice";

const Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");
        const state = urlParams.get("state");
        const token = urlParams.get("token");
        const user = urlParams.get("user");
        const isNewUser = urlParams.get("isNewUser") === "true";

        if (error) {
          setError("Authentication failed: " + error);
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Check if we have direct token and user data (from backend callback)
        if (token && user) {
          try {
            const userData = JSON.parse(decodeURIComponent(user));
            dispatch(
              setCredentials({
                user: userData,
                token: decodeURIComponent(token),
              })
            );

            // Redirect based on whether user is new or existing
            if (isNewUser) {
              navigate("/"); // Go to home page for new users
            } else {
              navigate("/profile"); // Go to profile for existing users
            }
            return;
          } catch (err) {
            console.error("Error parsing user data:", err);
          }
        }

        if (!code) {
          setError("No authorization code received");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Exchange authorization code for tokens
        const tokenResponse = await fetch(
          `http://localhost:5000/api/v1/auth/exchange?code=${code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!tokenResponse.ok) {
          throw new Error("Failed to exchange code for tokens");
        }

        const tokenData = await tokenResponse.json();

        if (!tokenData.success) {
          throw new Error(tokenData.message || "Authentication failed");
        }

        // Store user credentials in Redux and localStorage
        dispatch(
          setCredentials({
            user: tokenData.user,
            token: tokenData.token,
          })
        );

        // Redirect to profile page
        navigate("/profile");
      } catch (err) {
        console.error("Callback error:", err);
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [navigate, location, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Completing Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we complete your sign-in...
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  );
};

export default Callback;
