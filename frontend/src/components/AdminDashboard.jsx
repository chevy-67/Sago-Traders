import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const sidebarStyle = {
        width: '250px',
        backgroundColor: '#3E2723', // --secondary-brown
        color: 'white',
        minHeight: '100vh',
        padding: '20px',
        position: 'fixed',
        left: 0,
        top: 0
    };

    const mainContentStyle = {
        marginLeft: '250px',
        padding: '20px',
        backgroundColor: '#F5F5F5',
        minHeight: '100vh',
        flex: 1,
        minWidth: 0,
        width: 'calc(100vw - 250px)',
        boxSizing: 'border-box',
    };

    const linkStyle = ({ isActive }) => ({
        display: 'block',
        padding: '12px 15px',
        color: isActive ? '#E85D04' : 'white', // --primary-orange or white
        textDecoration: 'none',
        borderRadius: '4px',
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        marginBottom: '10px',
        transition: 'all 0.3s ease'
    });

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            <div style={sidebarStyle}>
                <h2 style={{ marginBottom: '40px', color: '#E85D04', textAlign: 'center' }}>Sago Admin</h2>
                <nav>
                    <NavLink to="/admin" end style={linkStyle}>
                        Dashboard Overview
                    </NavLink>
                    <NavLink to="/admin/specs" style={linkStyle}>
                        Product Specs
                    </NavLink>
                    <NavLink to="/admin/hero" style={linkStyle}>
                        Hero Banners
                    </NavLink>
                    {/* Add more links here as needed */}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#D32F2F',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={mainContentStyle}>
                <header style={{
                    marginBottom: '30px',
                    paddingBottom: '20px',
                    borderBottom: '2px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h1 style={{ fontSize: '24px', color: '#333' }}>Admin Panel</h1>
                </header>

                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;
