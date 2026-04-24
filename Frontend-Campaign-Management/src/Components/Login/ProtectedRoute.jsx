import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
   
  const token = localStorage.getItem("token");

    if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
  // const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  // return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
