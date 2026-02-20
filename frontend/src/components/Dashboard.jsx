import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          "http://localhost:2004/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setUser(res.data);
        setLoading(false);
      } catch {
        setError("Failed to load user data");
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "600px"
      }}>
        <p style={{ fontSize: "18px", color: "#666" }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: "40px 20px",
        minHeight: "600px",
        textAlign: "center"
      }}>
        <div style={{
          backgroundColor: "#fee",
          color: "#c33",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "600px",
      padding: "40px 20px",
      backgroundColor: "#f8f9fa"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        {/* Header Section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          borderBottom: "2px solid #dee2e6",
          paddingBottom: "20px"
        }}>
          <div>
            <h1 style={{
              margin: "0 0 10px 0",
              color: "#333",
              fontSize: "32px"
            }}>
              Welcome, {user?.phone}!
            </h1>
            <p style={{
              margin: 0,
              color: "#666",
              fontSize: "14px"
            }}>
              Manage your account and settings
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
          >
            Logout
          </button>
        </div>

        {/* User Info Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}>
          {/* Phone Card */}
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{
              margin: "0 0 10px 0",
              color: "#666",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase"
            }}>
              Phone Number
            </h3>
            <p style={{
              margin: 0,
              color: "#333",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {user?.phone}
            </p>
          </div>

          {/* Role Card */}
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{
              margin: "0 0 10px 0",
              color: "#666",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase"
            }}>
              Account Role
            </h3>
            <p style={{
              margin: 0,
              color: "#333",
              fontSize: "18px",
              fontWeight: "bold",
              textTransform: "capitalize"
            }}>
              {user?.role || "User"}
            </p>
          </div>

          {/* Account Created Card */}
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{
              margin: "0 0 10px 0",
              color: "#666",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase"
            }}>
              Account Created
            </h3>
            <p style={{
              margin: 0,
              color: "#333",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              }) : "N/A"}
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{
            margin: "0 0 20px 0",
            color: "#333",
            fontSize: "20px"
          }}>
            Account Details
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px"
          }}>
            {user?.email && (
              <div>
                <label style={{
                  display: "block",
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "5px",
                  fontWeight: "600"
                }}>
                  Email
                </label>
                <p style={{
                  margin: 0,
                  color: "#333",
                  fontSize: "16px"
                }}>
                  {user.email}
                </p>
              </div>
            )}

            {user?.name && (
              <div>
                <label style={{
                  display: "block",
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "5px",
                  fontWeight: "600"
                }}>
                  Full Name
                </label>
                <p style={{
                  margin: 0,
                  color: "#333",
                  fontSize: "16px"
                }}>
                  {user.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          marginTop: "40px",
          display: "flex",
          gap: "10px",
          justifyContent: "center"
        }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;