import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  requireAdmin = false,
  requireFaculty = false,
  allowRoles = null,
}) {
  const { isAuthenticated, user, loading } = useAuth();

  // Wait until AuthContext finishes checking localStorage
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#475569",
          }}
        >
          <div
            className="loading-spinner dark"
            style={{
              width: 40,
              height: 40,
              borderWidth: 4,
              margin: "0 auto 15px",
            }}
          />

          <p>Loading EduPredict...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // NOT LOGGED IN
  // =========================================================

  if (!isAuthenticated) {
    if (requireAdmin) {
      return <Navigate to="/admin-login" replace />;
    }

    if (requireFaculty) {
      return <Navigate to="/faculty-login" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  // =========================================================
  // ADMIN ONLY
  // =========================================================

  if (requireAdmin) {
    if (user?.role !== "Admin") {
      return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
  }

  // =========================================================
  // FACULTY ONLY
  // =========================================================

  if (requireFaculty) {
    if (user?.role !== "Faculty") {
      return <Navigate to="/faculty-login" replace />;
    }

    return <Outlet />;
  }

  // =========================================================
  // SPECIFIC ALLOWED ROLES
  // Example:
  // allowRoles={["Faculty", "Admin"]}
  // =========================================================

  if (allowRoles) {
    if (!user?.role || !allowRoles.includes(user.role)) {
      // Faculty
      if (user?.role === "Faculty") {
        return <Navigate to="/faculty" replace />;
      }

      // Admin
      if (user?.role === "Admin") {
        return <Navigate to="/admin" replace />;
      }

      // Student / User
      return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
  }

  // =========================================================
  // NORMAL AUTHENTICATED USER
  // =========================================================

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}