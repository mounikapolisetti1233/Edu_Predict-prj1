import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = {
  Excellent: "#10b981",
  Good: "#3b82f6",
  Average: "#f59e0b",
  "Needs Improvement": "#f97316",
  "At Risk": "#ef4444",
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resStudents, resPredictions] = await Promise.all([
        API.get("/students"),
        API.get("/predictions"),
      ]);
      setStudents(resStudents.data);
      setPredictions(resPredictions.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Compute metrics
  const totalStudents = students.length;
  const totalPredictions = predictions.length;

  const categoryCounts = {
    Excellent: 0,
    Good: 0,
    Average: 0,
    "Needs Improvement": 0,
    "At Risk": 0,
  };

  predictions.forEach((p) => {
    if (categoryCounts.hasOwnProperty(p.performanceCategory)) {
      categoryCounts[p.performanceCategory]++;
    }
  });

  const pieData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));

  // Department distribution
  const deptDataMap = {};
  students.forEach((s) => {
    if (!deptDataMap[s.department]) {
      deptDataMap[s.department] = { department: s.department, count: 0, avgMarks: 0, totalMarks: 0 };
    }
    deptDataMap[s.department].count++;
    deptDataMap[s.department].totalMarks += s.previousPercentage;
  });

  const barData = Object.values(deptDataMap).map((d) => ({
    department: d.department,
    studentsCount: d.count,
    avgScore: Math.round(d.totalMarks / d.count),
  }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name || "Educator"}!</h1>
          <p className="page-subtitle">
            AI-Driven Student Academic Performance Overview & Risk Monitoring
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/students/add" className="btn btn-secondary">
            <UserPlus size={18} />
            <span>Add Student</span>
          </Link>
          <Link to="/prediction" className="btn btn-primary">
            <TrendingUp size={18} />
            <span>Run Prediction</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          Loading performance analytics...
        </div>
      ) : (
        <>
          {/* Key Metrics Cards Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}>
                <Users />
              </div>
              <div className="metric-info">
                <div className="val">{totalStudents}</div>
                <div className="lbl">Total Students</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#d1fae5", color: "#10b981" }}>
                <Award />
              </div>
              <div className="metric-info">
                <div className="val">{categoryCounts.Excellent}</div>
                <div className="lbl">Excellent Performers</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#dbeafe", color: "#3b82f6" }}>
                <CheckCircle />
              </div>
              <div className="metric-info">
                <div className="val">{categoryCounts.Good}</div>
                <div className="lbl">Good Performers</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#fef3c7", color: "#f59e0b" }}>
                <TrendingUp />
              </div>
              <div className="metric-info">
                <div className="val">{categoryCounts.Average}</div>
                <div className="lbl">Average Performers</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#fee2e2", color: "#ef4444" }}>
                <AlertTriangle />
              </div>
              <div className="metric-info">
                <div className="val">{categoryCounts["At Risk"] + categoryCounts["Needs Improvement"]}</div>
                <div className="lbl">Needs Care / At Risk</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#f1f5f9", color: "#0f172a" }}>
                <TrendingUp />
              </div>
              <div className="metric-info">
                <div className="val">{totalPredictions}</div>
                <div className="lbl">Total Predictions</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
                Performance Category Breakdown
              </h3>
              {totalPredictions === 0 ? (
                <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
                  No predictions recorded yet. Run a prediction to see distribution.
                </p>
              ) : (
                <div style={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#8884d8"} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
                Department-wise Student Count & Avg Score
              </h3>
              {barData.length === 0 ? (
                <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
                  No student records available. Add students to display department stats.
                </p>
              ) : (
                <div style={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="studentsCount" name="Students Count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="avgScore" name="Avg Score %" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Recent Predictions Table */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                Recent Student Predictions
              </h3>
              <Link to="/analytics" style={{ fontSize: "0.875rem", color: "#4f46e5", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                View Full Analytics <ArrowRight size={16} />
              </Link>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Department</th>
                    <th>Attendance</th>
                    <th>Predicted Score</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                        No prediction history available yet.
                      </td>
                    </tr>
                  ) : (
                    predictions.slice(0, 5).map((pred) => {
                      const catClass = pred.performanceCategory.toLowerCase().replace(/\s+/g, "-");
                      return (
                        <tr key={pred._id}>
                          <td style={{ fontWeight: 700 }}>{pred.student?.studentId || "N/A"}</td>
                          <td>{pred.student?.name || "Unknown Student"}</td>
                          <td>{pred.student?.department || "N/A"}</td>
                          <td>{pred.inputAcademicData?.attendancePercentage}%</td>
                          <td style={{ fontWeight: 700, color: "#0f172a" }}>
                            {pred.predictedPercentage}%
                          </td>
                          <td>
                            <span className={`badge badge-${catClass}`}>
                              {pred.performanceCategory}
                            </span>
                          </td>
                          <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            {new Date(pred.predictionDate).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
