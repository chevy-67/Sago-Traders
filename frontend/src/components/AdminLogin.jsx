import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
    const { login } = useAuth();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!phone.trim() || !password.trim()) {
            setError("Please enter both phone number and password");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE}/admin/login`, {
                phone,
                password,
            });

            login(res.data.user, res.data.token);
            navigate("/admin");
        } catch (error) {
            setError(error.response?.data?.message || "Invalid credentials or server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: "40px 20px",
            maxWidth: "400px",
            margin: "100px auto",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            background: "#fff"
        }}>
            <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#333" }}>Admin Login</h2>
            <p style={{ textAlign: "center", marginBottom: "30px", color: "#666", fontSize: "14px" }}>
                Access the management dashboard
            </p>

            {error && (
                <div style={{
                    padding: "12px",
                    marginBottom: "20px",
                    backgroundColor: "#fff5f5",
                    color: "#e53e3e",
                    border: "1px solid #fed7d7",
                    borderRadius: "6px",
                    fontSize: "14px"
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter admin phone number"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            boxSizing: "border-box",
                            transition: "border-color 0.2s"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "30px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            boxSizing: "border-box",
                            transition: "border-color 0.2s"
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#4a5568",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1,
                        fontSize: "16px",
                        fontWeight: "bold",
                        transition: "background-color 0.2s"
                    }}
                >
                    {loading ? "Logging in..." : "Login as Admin"}
                </button>
            </form>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#666",
                        cursor: "pointer",
                        fontSize: "14px",
                        textDecoration: "underline"
                    }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
