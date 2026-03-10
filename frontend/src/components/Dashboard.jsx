import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Home, LogOut } from "lucide-react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        const res = await axios.get("http://localhost:2004/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setLoading(false);
      } catch {
        setError("Failed to load user data. Redirecting to login…");
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
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dash-spinner" />
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">

        {/* ── Header ── */}
        <div className="dashboard-header">
          <div className="dashboard-greeting">
            <h1>Welcome back, {user?.name || user?.phone}! 👋</h1>
            <p>Manage your account, orders, and preferences</p>
          </div>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card-label">Phone Number</div>
            <div className="stat-card-value">{user?.phone || "—"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Account Role</div>
            <div className="stat-card-value" style={{ textTransform: 'capitalize' }}>
              {user?.role || "User"}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Member Since</div>
            <div className="stat-card-value">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" })
                : "N/A"}
            </div>
          </div>
        </div>

        {/* ── Account Details ── */}
        <div className="dashboard-details-card">
          <h2>Account Details</h2>
          <div className="details-grid">
            {user?.name && (
              <div className="detail-item">
                <label>Full Name</label>
                <p>{user.name}</p>
              </div>
            )}
            {user?.email && (
              <div className="detail-item">
                <label>Email Address</label>
                <p>{user.email}</p>
              </div>
            )}
            {user?.phone && (
              <div className="detail-item">
                <label>Phone</label>
                <p>{user.phone}</p>
              </div>
            )}
            <div className="detail-item">
              <label>Account Status</label>
              <p style={{ color: 'var(--success, #10b981)', fontWeight: 800 }}>✓ Active</p>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="dashboard-actions">
          <button className="dash-btn dash-btn-primary" onClick={() => navigate("/")}>
            <Home size={16} /> Back to Home
          </button>
          <button className="dash-btn dash-btn-secondary" onClick={() => navigate("/my-orders")}>
            <ShoppingBag size={16} /> My Orders
          </button>
          <button className="dash-btn dash-btn-secondary" onClick={() => navigate("/profile")}>
            My Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;