import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AdminAuthContext);

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;
