import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, isAdmin, children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If trying to access admin route without admin privileges
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // If admin trying to access user routes
  if (isAdmin && !isAdminRoute) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;