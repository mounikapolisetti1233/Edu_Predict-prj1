import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function FacultyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();

    toast.addToast(
      "Faculty logged out successfully.",
      "info"
    );

    navigate("/faculty-login", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, #2563eb, #4f46e5)",
            color: "#fff",
            padding: "30px",
            borderRadius: "18px",
            marginBottom: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>
              Faculty / Mentor Dashboard
            </h1>

            <p style={{ marginTop: "8px", opacity: 0.9 }}>
              Welcome, {user?.name || "Faculty"}
            </p>

            <p style={{ margin: 0, opacity: 0.8 }}>
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#fff",
              color: "#2563eb",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
            }}
          >
            <h2>👨‍🎓</h2>
            <h3>Students</h3>
            <p>
              View and monitor student information.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
            }}
          >
            <h2>📊</h2>
            <h3>Performance</h3>
            <p>
              Monitor student performance and progress.
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
            }}
          >
            <h2>🔮</h2>
            <h3>Predictions</h3>
            <p>
              View AI-powered student predictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}