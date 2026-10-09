import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function FacultyDashboard() {
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
        {/* Header */}
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

            <p
              style={{
                marginTop: "8px",
                opacity: 0.9,
              }}
            >
              Welcome, {user?.name || "Faculty"}
            </p>

            <p
              style={{
                margin: 0,
                opacity: 0.8,
              }}
            >
              {user?.email || ""}
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

        {/* Welcome Message */}
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "14px",
            marginBottom: "25px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#1e293b",
            }}
          >
            Faculty Control Panel
          </h2>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.7,
              marginBottom: 0,
            }}
          >
            From here you can enter and manage student academic
            information. Students can view their information but
            cannot modify it.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Student Management */}
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
              borderTop: "4px solid #2563eb",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "12px",
              }}
            >
              👨‍🎓
            </div>

            <h3
              style={{
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              Student Management
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Add new students, update student academic
              information and manage student records.
            </p>

            <button
              onClick={() => navigate("/students")}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background:
                  "linear-gradient(135deg, #2563eb, #4f46e5)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Manage Students →
            </button>
          </div>

          {/* Performance */}
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
              borderTop: "4px solid #059669",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "12px",
              }}
            >
              📊
            </div>

            <h3
              style={{
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              Student Performance
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Monitor attendance, internal marks, assignments,
              study hours and overall student performance.
            </p>

            <button
              onClick={() => navigate("/students")}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background: "#059669",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View Students →
            </button>
          </div>

          {/* Predictions */}
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
              borderTop: "4px solid #7c3aed",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "12px",
              }}
            >
              🔮
            </div>

            <h3
              style={{
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              AI Predictions
            </h3>

            <p
              style={{
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Analyze student performance and view AI-powered
              predictions and recommendations.
            </p>

            <button
              onClick={() => navigate("/predictions")}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                background: "#7c3aed",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View Predictions →
            </button>
          </div>
        </div>

        {/* Faculty Responsibilities */}
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "14px",
            marginTop: "25px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              color: "#1e293b",
            }}
          >
            👨‍🏫 Faculty Responsibilities
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "15px",
                background: "#eff6ff",
                borderRadius: "10px",
                color: "#1e40af",
              }}
            >
              ✓ Enter student information
            </div>

            <div
              style={{
                padding: "15px",
                background: "#ecfdf5",
                borderRadius: "10px",
                color: "#047857",
              }}
            >
              ✓ Update academic records
            </div>

            <div
              style={{
                padding: "15px",
                background: "#f5f3ff",
                borderRadius: "10px",
                color: "#6d28d9",
              }}
            >
              ✓ Monitor student performance
            </div>

            <div
              style={{
                padding: "15px",
                background: "#fff7ed",
                borderRadius: "10px",
                color: "#c2410c",
              }}
            >
              ✓ View AI predictions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}