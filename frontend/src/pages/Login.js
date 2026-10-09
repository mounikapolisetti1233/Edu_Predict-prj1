import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            if (response.data.user.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/student-dashboard");
            }

        } catch (error) {
            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Invalid email or password"
                );
            } else {
                setError(
                    "Unable to connect to server. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>Edupredict Student</h1>

                <h2>Login</h2>

                <p className="login-subtitle">
                    Student/Admin login
                </p>

                <div className="role-buttons">

                    <button
                        type="button"
                        className={role === "student" ? "active-role" : ""}
                        onClick={() => setRole("student")}
                    >
                        Student
                    </button>

                    <button
                        type="button"
                        className={role === "admin" ? "active-role" : ""}
                        onClick={() => setRole("admin")}
                    >
                        Admin
                    </button>

                </div>

                {error && (
                    <p
                        style={{
                            color: "red",
                            textAlign: "center",
                            marginBottom: "15px"
                        }}
                    >
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin} autoComplete="off">

                    <label>Email</label>

                    <input
                        type="email"
                        name="login-email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="new-email"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="login-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="register-text">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;