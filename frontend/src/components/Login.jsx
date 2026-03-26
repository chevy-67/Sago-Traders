import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/google`, {
        credential: credentialResponse.credential,
      });

      login(res.data.user, res.data.token);

      if (onLoginSuccess) {
        onLoginSuccess(res.data.user);
      } else {
        const role = res.data.user?.role;
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Google sign-in failed. Please try again."
      );
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed. Please try again.");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#f5f5f5"
    }}>
      <div style={{
        padding: "48px 40px",
        maxWidth: "400px",
        width: "100%",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px", color: "#1a1a1a" }}>
          Welcome to Sago Traders
        </h1>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "32px" }}>
          Sign in to continue to your account
        </p>

        {error && (
          <div style={{
            padding: "10px 14px",
            marginBottom: "20px",
            backgroundColor: "#fff0f0",
            color: "#d32f2f",
            borderRadius: "6px",
            fontSize: "14px",
            border: "1px solid #ffd0d0"
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            text="signin_with"
            shape="rectangular"
            theme="outline"
            size="large"
            width="320"
          />
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "10px" }}>
            Are you an admin?
          </p>
          <button
            onClick={() => navigate("/admin/login")}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "underline",
              padding: 0
            }}
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
