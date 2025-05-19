import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />; // Redirect to login page if not logged in
  }
  return children; // Render the protected page if logged in
};

export default ProtectedRoute;