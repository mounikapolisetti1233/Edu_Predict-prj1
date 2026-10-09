import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  TrendingUp,
  BarChart3,
  Shield,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const { isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/students"
        end
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <Users size={20} />
        <span>Students</span>
      </NavLink>

      <NavLink
        to="/students/add"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <UserPlus size={20} />
        <span>Add Student</span>
      </NavLink>

      <NavLink
        to="/prediction"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <TrendingUp size={20} />
        <span>Prediction</span>
      </NavLink>

      <NavLink
        to="/analytics"
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      >
        <BarChart3 size={20} />
        <span>Analytics</span>
      </NavLink>

      {isAdmin && (
        <NavLink
          to="/admin"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <Shield size={20} />
          <span>Admin</span>
        </NavLink>
      )}

      <button
        onClick={handleLogout}
        className="nav-link"
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          marginTop: "auto",
          color: "#ef4444",
        }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
