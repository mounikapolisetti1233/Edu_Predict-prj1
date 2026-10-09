import React, { useState, useEffect } from "react";
import API from "../services/api";
import { BarChart3, PieChart as PieIcon, TrendingUp, Users } from "lucide-react";
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
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const CATEGORY_COLORS = {
  Excellent: "#10b981",
  Good: "#3b82f6",
  Average: "#f59e0b",
  "Needs Improvement": "#f97316",
  "At Risk": "#ef4444",
};

const Analytics = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resPreds = await API.get("/predictions");
      setPredictions(resPreds.data);
    } catch (err) {
      console.error("Failed to load analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pie Chart Data
  const catMap = { Excellent: 0, Good: 0, Average: 0, "Needs Improvement": 0, "At Risk": 0 };
  predictions.forEach((p) => {
    if (catMap.hasOwnProperty(p.performanceCategory)) {
      catMap[p.performanceCategory]++;
    }
  });
  const pieData = Object.keys(catMap).map((cat) => ({
    name: cat,
    value: catMap[cat],
  }));

  // Attendance vs Predicted Scatter Data
  const scatterData = predictions.map((p) => ({
    name: p.student?.name || "Student",
    attendance: p.inputAcademicData?.attendancePercentage || 0,
    predicted: p.predictedPercentage || 0,
  }));

  // Study Hours vs Marks Data
  const studyHoursMap = [
    { label: "1-2 hrs", min: 0, max: 2, count: 0, totalScore: 0 },
    { label: "3-4 hrs", min: 2.1, max: 4, count: 0, totalScore: 0 },
    { label: "5-6 hrs", min: 4.1, max: 6, count: 0, totalScore: 0 },
    { label: "7+ hrs", min: 6.1, max: 24, count: 0, totalScore: 0 },
  ];

  predictions.forEach((p) => {
    const hrs = p.inputAcademicData?.studyHoursPerDay || 0;
    const score = p.predictedPercentage || 0;
    const group = studyHoursMap.find((g) => hrs >= g.min && hrs <= g.max);
    if (group) {
      group.count++;
      group.totalScore += score;
    }
  });

  const studyHoursChartData = studyHoursMap.map((g) => ({
    label: g.label,
    avgScore: g.count > 0 ? Math.round(g.totalScore / g.count) : 0,
    studentsCount: g.count,
  }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BarChart3 size={28} color="#4f46e5" />
            Performance Analytics & AI Insights
          </h1>
          <p className="page-subtitle">
            Comparative multi-dimensional analysis of student attendance, study habits, and risk categories
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          Loading analytical charts...
        </div>
      ) : (
        <>
          {/* Charts Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <PieIcon size={20} color="#4f46e5" />
                Performance Category Distribution
              </h3>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <TrendingUp size={20} color="#10b981" />
                Impact of Study Hours on Predicted Performance
              </h3>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={studyHoursChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgScore" name="Avg Predicted Score %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Scatter Chart Row */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={20} color="#0ea5e9" />
              Attendance Percentage vs Predicted Score Correlation
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="attendance" name="Attendance %" unit="%" domain={[0, 100]} />
                  <YAxis type="number" dataKey="predicted" name="Predicted Score" unit="%" domain={[0, 100]} />
                  <ZAxis range={[60, 60]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Students" data={scatterData} fill="#4f46e5" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Complete Predictions Log */}
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
              Full Historical Prediction Log
            </h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Dept</th>
                    <th>Prev %</th>
                    <th>Att %</th>
                    <th>Hours/Day</th>
                    <th>Backlogs</th>
                    <th>Predicted Score</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center", padding: "2rem" }}>
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    predictions.map((p) => {
                      const catClass = p.performanceCategory.toLowerCase().replace(/\s+/g, "-");
                      return (
                        <tr key={p._id}>
                          <td style={{ fontWeight: 700 }}>{p.student?.studentId || "N/A"}</td>
                          <td>{p.student?.name || "Unknown"}</td>
                          <td>{p.student?.department || "N/A"}</td>
                          <td>{p.inputAcademicData?.previousPercentage}%</td>
                          <td>{p.inputAcademicData?.attendancePercentage}%</td>
                          <td>{p.inputAcademicData?.studyHoursPerDay} hrs</td>
                          <td>{p.inputAcademicData?.backlogs}</td>
                          <td style={{ fontWeight: 700, color: "#4f46e5" }}>
                            {p.predictedPercentage}%
                          </td>
                          <td>
                            <span className={`badge badge-${catClass}`}>
                              {p.performanceCategory}
                            </span>
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

export default Analytics;
