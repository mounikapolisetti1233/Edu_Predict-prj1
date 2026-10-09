import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const Prediction = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [academicData, setAcademicData] = useState({
    previousPercentage: 75,
    attendancePercentage: 80,
    internalMarks: 70,
    assignmentMarks: 75,
    studyHoursPerDay: 4,
    backlogs: 0,
    participationLevel: "Medium",
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

  const handleStudentSelect = (e) => {
    const id = e.target.value;
    setSelectedStudentId(id);

    if (id) {
      const s = students.find((item) => item._id === id);
      if (s) {
        setAcademicData({
          previousPercentage: s.previousPercentage,
          attendancePercentage: s.attendancePercentage,
          internalMarks: s.internalMarks,
          assignmentMarks: s.assignmentMarks,
          studyHoursPerDay: s.studyHoursPerDay,
          backlogs: s.backlogs,
          participationLevel: s.participationLevel || "Medium",
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAcademicData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedStudentId) {
      setError("Please select a student to run performance prediction.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        studentId: selectedStudentId,
        academicData: {
          previousPercentage: Number(academicData.previousPercentage),
          attendancePercentage: Number(academicData.attendancePercentage),
          internalMarks: Number(academicData.internalMarks),
          assignmentMarks: Number(academicData.assignmentMarks),
          studyHoursPerDay: Number(academicData.studyHoursPerDay),
          backlogs: Number(academicData.backlogs),
          participationLevel: academicData.participationLevel,
        },
      };

      const res = await API.post("/predictions", payload);
      setPredictionResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to calculate prediction result."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeClass = (category) => {
    if (!category) return "badge-average";
    const catLower = category.toLowerCase();
    if (catLower.includes("excellent")) return "badge-excellent";
    if (catLower.includes("good")) return "badge-good";
    if (catLower.includes("average")) return "badge-average";
    if (catLower.includes("needs")) return "badge-needs-imp";
    return "badge-at-risk";
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={28} color="#4f46e5" />
            AI Student Performance Prediction Engine
          </h1>
          <p className="page-subtitle">
            Simulate and calculate student performance outcomes based on weighted academic indicators
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.5rem" }}>
        {/* Input Parameters Form */}
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={20} color="#4f46e5" />
            Academic Parameters Input
          </h3>

          <form onSubmit={handlePredict}>
            <div className="form-group">
              <label className="form-label">Select Student Record *</label>
              <select
                className="form-select"
                value={selectedStudentId}
                onChange={handleStudentSelect}
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.studentId} - {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Previous Semester % ({academicData.previousPercentage}%)
              </label>
              <input
                type="range"
                name="previousPercentage"
                min="0"
                max="100"
                className="form-input"
                style={{ height: "8px", padding: 0 }}
                value={academicData.previousPercentage}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Attendance % ({academicData.attendancePercentage}%)
              </label>
              <input
                type="range"
                name="attendancePercentage"
                min="0"
                max="100"
                className="form-input"
                style={{ height: "8px", padding: 0 }}
                value={academicData.attendancePercentage}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-grid" style={{ marginBottom: "1.25rem" }}>
              <div className="form-group">
                <label className="form-label">Internal Marks %</label>
                <input
                  type="number"
                  name="internalMarks"
                  min="0"
                  max="100"
                  className="form-input"
                  value={academicData.internalMarks}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assignment Marks %</label>
                <input
                  type="number"
                  name="assignmentMarks"
                  min="0"
                  max="100"
                  className="form-input"
                  value={academicData.assignmentMarks}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Study Hours / Day</label>
                <input
                  type="number"
                  name="studyHoursPerDay"
                  min="0"
                  max="24"
                  step="0.5"
                  className="form-input"
                  value={academicData.studyHoursPerDay}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Active Backlogs</label>
                <input
                  type="number"
                  name="backlogs"
                  min="0"
                  className="form-input"
                  value={academicData.backlogs}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.75rem" }}>
              <label className="form-label">Class Participation</label>
              <select
                name="participationLevel"
                className="form-select"
                value={academicData.participationLevel}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem" }}
              disabled={loading}
            >
              <TrendingUp size={18} />
              <span>{loading ? "Calculating Prediction..." : "Predict Student Performance"}</span>
            </button>
          </form>
        </div>

        {/* Output Results Display */}
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Award size={20} color="#10b981" />
            Prediction Result & Recommendations
          </h3>

          {!predictionResult ? (
            <div style={{ textAlign: "center", padding: "4rem 1.5rem", color: "#94a3b8" }}>
              <Sparkles size={48} strokeWidth={1} style={{ marginBottom: "1rem", color: "#cbd5e1" }} />
              <p style={{ fontWeight: 600, fontSize: "1rem" }}>No Prediction Calculated Yet</p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                Select a student record, adjust the academic indicators on the left, and click <strong>Predict Student Performance</strong>.
              </p>
            </div>
          ) : (
            <div>
              {/* Score Display Card */}
              <div
                style={{
                  background: "linear-gradient(135deg, #0f172a, #1e293b)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  color: "white",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>
                  Predicted Score Percentage
                </div>
                <div style={{ fontSize: "3.2rem", fontWeight: 800, color: "#38bdf8", margin: "0.25rem 0" }}>
                  {predictionResult.predictedPercentage}%
                </div>
                <div>
                  <span className={`badge ${getCategoryBadgeClass(predictionResult.performanceCategory)}`} style={{ fontSize: "0.9rem", padding: "0.4rem 1rem" }}>
                    Category: {predictionResult.performanceCategory}
                  </span>
                </div>
              </div>

              {/* Student Summary */}
              <div style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                <p><strong>Student:</strong> {predictionResult.student?.name} ({predictionResult.student?.studentId})</p>
                <p><strong>Department:</strong> {predictionResult.student?.department}</p>
                <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.25rem" }}>
                  Calculated & saved on {new Date(predictionResult.predictionDate).toLocaleString()}
                </p>
              </div>

              {/* Actionable Recommendations */}
              <div style={{ backgroundColor: "#f8fafc", borderRadius: "10px", padding: "1.25rem", border: "1px solid #e2e8f0" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  AI Academic Recommendations
                </h4>
                <p style={{ fontSize: "0.875rem", color: "#334155", lineHeight: 1.6 }}>
                  {predictionResult.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
