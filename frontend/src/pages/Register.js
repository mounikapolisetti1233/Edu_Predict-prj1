import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    email,
                    password,
                    role: "student"
                }
            );

            setSuccess("Registration successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Registration failed"
                );
            } else {
                setError(
                    "Unable to connect to server."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>Campus Complaint</h1>

                <h2>Create Account</h2>

                <p className="login-subtitle">
                    Register as a student
                </p>

                {error && (
                    <p
                        style={{
                            color: "red",
                            textAlign: "center"
                        }}
                    >
                        {error}
                    </p>
                )}

                {success && (
                    <p
                        style={{
                            color: "green",
                            textAlign: "center"
                        }}
                    >
                        {success}
                    </p>
                )}

                <form
                    onSubmit={handleRegister}
                    autoComplete="off"
                >

                    <label>Name</label>

                    <input
                        type="text"
                        name="register-student-name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="off"
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        name="register-student-email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="register-student-password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength="6"
                        required
                    />

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                <p className="register-text">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;