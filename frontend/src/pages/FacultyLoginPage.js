import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function FacultyLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
      });

      // Only Faculty can access this login
      if (data.role !== "Faculty") {
        setError("Access denied. This account is not registered as Faculty/Mentor.");
        toast.addToast(
          "Access denied. Please use Faculty/Mentor credentials.",
          "error"
        );
        setLoading(false);
        return;
      }

      login(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        data.token
      );

      toast.addToast(
        `Welcome ${data.name}! Faculty login successful.`,
        "success"
      );

      navigate("/faculty", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #eff6ff, #eef2ff)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#fff",
          borderRadius: "18px",
          padding: "35px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "65px",
              height: "65px",
              margin: "0 auto 15px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
            }}
          >
            👨‍🏫
          </div>

          <h1 style={{ margin: 0, fontSize: "1.7rem" }}>
            Faculty / Mentor Login
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "8px",
            }}
          >
            Login to manage student performance
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 600,
              }}
            >
              Faculty Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter faculty email"
              autoComplete="off"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 600,
              }}
            >
              Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="new-password"
                style={{
                  width: "100%",
                  padding: "12px 45px 12px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login as Faculty"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            fontSize: "0.9rem",
          }}
        >
          New Faculty / Mentor?{" "}
          <Link
            to="/faculty-register"
            style={{
              color: "#2563eb",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Register Here
          </Link>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "12px",
          }}
        >
          <Link
            to="/login"
            style={{
              color: "#64748b",
              textDecoration: "none",
              fontSize: "0.85rem",
            }}
          >
            ← Student Login
          </Link>
        </div>
      </div>
    </div>
  );
}