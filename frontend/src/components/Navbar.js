import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { GraduationCap, LogOut, User as UserIcon, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <GraduationCap size={24} />
        </div>
        <span>EduPredict</span>
      </div>

      {user && (
        <div className="user-menu">
          <div className="user-badge">
            {user.role === "Admin" ? (
              <ShieldCheck size={16} color="#4f46e5" />
            ) : (
              <UserIcon size={16} color="#64748b" />
            )}
            <span>{user.name}</span>
            <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "0.25rem" }}>
              ({user.role})
            </span>
          </div>

          <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
