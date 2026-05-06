import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  // admin route only
  if (allowedRole === true && !isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  // user route only
  if (allowedRole === false && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;