import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getSessionUser } from '../../session';

// The API enforces permissions; these guards just keep the UI from showing
// pages that would only fail, and send visitors to the login page instead.
export function RequireAuth() {
  const location = useLocation();
  if (!getSessionUser()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function RequireAdmin() {
  const location = useLocation();
  const user = getSessionUser();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (user.role === 0) {
    return <Navigate to={`/home/${user._id}`} replace />;
  }
  return <Outlet />;
}
