import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const rolePaths = {
  admin: '/admin/dashboard',
  instructor: '/instructor/dashboard',
  student: '/student/dashboard',
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  const hasAccess = Array.isArray(allowedRoles) && allowedRoles.includes(user.role);

  if (!hasAccess) {
    const redirectPath = rolePaths[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleRoute;
