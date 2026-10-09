import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/admin/students",
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            setStudents(response.data);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load student performance data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const totalStudents = students.length;

    const highRisk = students.filter(
        (student) =>
            student.prediction === "High Risk" ||
            student.riskLevel === "High Risk"
    ).length;

    const mediumRisk = students.filter(
        (student) =>
            student.prediction === "Medium Risk" ||
            student.riskLevel === "Medium Risk"
    ).length;

    const lowRisk = students.filter(
        (student) =>
            student.prediction === "Low Risk" ||
            student.riskLevel === "Low Risk"
    ).length;

    const getRiskClass = (risk) => {
        if (risk === "High Risk") {
            return "high-risk";
        }

        if (risk === "Medium Risk") {
            return "medium-risk";
        }

        if (risk === "Low Risk") {
            return "low-risk";
        }

        return "no-risk";
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-loading">
                    <h2>Loading EduPredict...</h2>
                    <p>
                        Loading student performance data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">

            {/* ================= NAVBAR ================= */}

            <nav className="dashboard-navbar">

                <div className="admin-brand">

                    <div className="admin-logo">
                        🎓
                    </div>

                    <div>
                        <h2>EduPredict</h2>

                        <span>
                            AI-POWERED PERFORMANCE PREDICTOR
                        </span>
                    </div>

                </div>

                <div className="dashboard-links">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* ================= HEADER ================= */}

            <section className="admin-header">

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    EduPredict - AI-Powered Student Performance
                    Prediction System
                </p>

            </section>


            {/* ================= ERROR ================= */}

            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}


            {/* ================= STATISTICS ================= */}

            <section className="admin-stats">

                <div className="admin-stat-card">

                    <div className="stat-icon">
                        👨‍🎓
                    </div>

                    <div>
                        <p>Total Students</p>
                        <h2>{totalStudents}</h2>
                    </div>

                </div>


                <div className="admin-stat-card">

                    <div className="stat-icon">
                        🔴
                    </div>

                    <div>
                        <p>High Risk</p>
                        <h2>{highRisk}</h2>
                    </div>

                </div>


                <div className="admin-stat-card">

                    <div className="stat-icon">
                        🟡
                    </div>

                    <div>
                        <p>Medium Risk</p>
                        <h2>{mediumRisk}</h2>
                    </div>

                </div>


                <div className="admin-stat-card">

                    <div className="stat-icon">
                        🟢
                    </div>

                    <div>
                        <p>Low Risk</p>
                        <h2>{lowRisk}</h2>
                    </div>

                </div>

            </section>


            {/* ================= STUDENT PERFORMANCE ================= */}

            <main className="admin-content">

                <div className="section-heading">

                    <div>
                        <h2>
                            Student Performance Predictions
                        </h2>

                        <p>
                            Monitor student performance and
                            AI-generated predictions.
                        </p>
                    </div>

                </div>


                {/* ================= NO DATA ================= */}

                {students.length === 0 ? (

                    <div className="admin-empty">

                        <div className="empty-icon">
                            📊
                        </div>

                        <h3>
                            No Student Data Available
                        </h3>

                        <p>
                            Student performance predictions
                            will appear here.
                        </p>

                    </div>

                ) : (

                    /* ================= STUDENT LIST ================= */

                    <div className="student-performance-list">

                        {students.map((student) => {

                            const risk =
                                student.prediction ||
                                student.riskLevel ||
                                "Not Predicted";

                            return (

                                <div
                                    className="student-performance-card"
                                    key={student._id}
                                >

                                    {/* STUDENT HEADER */}

                                    <div className="student-card-header">

                                        <div>

                                            <h3>
                                                {student.name ||
                                                    "Unknown Student"}
                                            </h3>

                                            <p>
                                                {student.email ||
                                                    "Email not available"}
                                            </p>

                                        </div>

                                        <span
                                            className={
                                                "risk-badge " +
                                                getRiskClass(risk)
                                            }
                                        >
                                            {risk}
                                        </span>

                                    </div>


                                    {/* PERFORMANCE DETAILS */}

                                    <div className="performance-details">

                                        <div>
                                            <span>
                                                Attendance
                                            </span>

                                            <strong>
                                                {student.attendance !==
                                                undefined
                                                    ? `${student.attendance}%`
                                                    : "N/A"}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Internal Marks
                                            </span>

                                            <strong>
                                                {student.internalMarks !==
                                                undefined
                                                    ? student.internalMarks
                                                    : "N/A"}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Assignment Score
                                            </span>

                                            <strong>
                                                {student.assignmentScore !==
                                                undefined
                                                    ? student.assignmentScore
                                                    : "N/A"}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Previous Score
                                            </span>

                                            <strong>
                                                {student.previousScore !==
                                                undefined
                                                    ? student.previousScore
                                                    : "N/A"}
                                            </strong>
                                        </div>

                                    </div>


                                    {/* AI PREDICTION */}

                                    <div className="ai-prediction">

                                        <strong>
                                            🤖 AI Prediction
                                        </strong>

                                        <p>
                                            {risk}
                                        </p>

                                    </div>

                                </div>

                            );
                        })}

                    </div>

                )}

            </main>

        </div>
    );
}

export default AdminDashboard;