import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'admin') {
        // Redirect non-admins to home or user dashboard
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default AdminRoute;
