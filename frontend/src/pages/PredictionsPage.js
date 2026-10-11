
import React, { useState, useEffect, useCallback } from "react";
import { studentsAPI, predictionsAPI } from "../api/api";
import { useToast } from "../context/ToastContext";

const catClass = (cat) => {
  const map = {
    Excellent: "excellent",
    Good: "good",
    Average: "average",
    "Needs Improvement": "needs",
    "At Risk": "risk",
  };

  return map[cat] || "average";
};

const catColor = (cat) => {
  const map = {
    Excellent: "#10b981",
    Good: "#4f46e5",
    Average: "#f59e0b",
    "Needs Improvement": "#f97316",
    "At Risk": "#ef4444",
  };

  return map[cat] || "#94a3b8";
};

const catBg = (cat) => {
  const map = {
    Excellent: "#d1fae5",
    Good: "#ede9fe",
    Average: "#fef3c7",
    "Needs Improvement": "#fed7aa",
    "At Risk": "#fee2e2",
  };

  return map[cat] || "#f1f5f9";
};

export default function PredictionsPage() {
  const [students, setStudents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);

  const [loadingPred, setLoadingPred] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [studentError, setStudentError] = useState("");
  const [activeTab, setActiveTab] = useState("run");

  const toast = useToast();

  // Load all students.
  const fetchStudents = useCallback(async () => {
    setLoadingStudents(true);
    setStudentError("");

    try {
      const response = await studentsAPI.getAll();
      const data = response.data;

      // The current backend returns an array.
      const studentList = Array.isArray(data)
        ? data
        : Array.isArray(data?.students)
        ? data.students
        : [];

      setStudents(studentList);

      // Clear selection if the selected student no longer exists.
      setSelected((current) =>
        studentList.some((student) => student._id === current)
          ? current
          : ""
      );
    } catch (error) {
      console.error(
        "Failed to fetch students:",
        error.response?.status,
        error.response?.data || error.message
      );

      setStudents([]);

      const message =
        error.response?.data?.message ||
        "Unable to load students. Please check your login and backend.";

      setStudentError(message);
      toast.addToast(message, "error");
    } finally {
      setLoadingStudents(false);
    }
  }, [toast]);

  // Load prediction history.
  const fetchPredictions = useCallback(async () => {
    setLoadingList(true);

    try {
      const response = await predictionsAPI.getAll();
      const data = response.data;

      setPredictions(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.predictions)
          ? data.predictions
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch predictions:",
        error.response?.data || error.message
      );

      setPredictions([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchPredictions();
  }, [fetchStudents, fetchPredictions]);

  // Generate a prediction for the selected student.
  const handlePredict = async () => {
    if (!selected) {
      toast.addToast("Please select a student first.", "warning");
      return;
    }

    setLoadingPred(true);
    setResult(null);

    try {
      const response = await predictionsAPI.create({
        studentId: selected,
      });

      setResult(response.data);

      await fetchPredictions();

      toast.addToast(
        "Prediction generated successfully!",
        "success"
      );
    } catch (error) {
      console.error(
        "Prediction error:",
        error.response?.data || error.message
      );

      toast.addToast(
        error.response?.data?.message ||
          "Failed to generate prediction.",
        "error"
      );
    } finally {
      setLoadingPred(false);
    }
  };

  const selectedStudent = students.find(
    (student) => student._id === selected
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Predictions</h1>
          <p>Run AI-powered performance predictions for students</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 24,
        }}
      >
        <button
          className={`btn ${
            activeTab === "run" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => setActiveTab("run")}
        >
          🔮 Run Prediction
        </button>

        <button
          className={`btn ${
            activeTab === "history" ? "btn-primary" : "btn-secondary"
          }`}
          onClick={() => setActiveTab("history")}
        >
          📋 History ({predictions.length})
        </button>
      </div>

      {activeTab === "run" && (
        <div className="grid-2">
          <div className="card">
            <h2 className="section-title">Select Student</h2>

            {loadingStudents ? (
              <div className="loading-center">
                <div className="loading-spinner dark" />
                <p>Loading students...</p>
              </div>
            ) : studentError ? (
              <div className="empty-state">
                <p>{studentError}</p>

                <button
                  className="btn btn-primary"
                  onClick={fetchStudents}
                >
                  Retry
                </button>
              </div>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <p>No students available. Add students first.</p>
              </div>
            ) : (
              <>
                <div
                  className="form-group"
                  style={{ marginBottom: 20 }}
                >
                  <label className="form-label" htmlFor="studentSelect">
                    Student
                  </label>

                  <select
                    id="studentSelect"
                    className="form-control"
                    value={selected}
                    onChange={(event) => {
                      setSelected(event.target.value);
                      setResult(null);
                    }}
                  >
                    <option value="">— Select a student —</option>

                    {students.map((student) => (
                      <option
                        key={student._id}
                        value={student._id}
                      >
                        {student.name} ({student.studentId}) ·{" "}
                        {student.department}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStudent && (
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: 10,
                      padding: 16,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      className="section-title"
                      style={{ marginBottom: 10 }}
                    >
                      Academic Data
                    </div>

                    {[
                      [
                        "Previous %",
                        `${selectedStudent.previousPercentage}%`,
                      ],
                      [
                        "Attendance %",
                        `${selectedStudent.attendancePercentage}%`,
                      ],
                      ["Internal Marks", selectedStudent.internalMarks],
                      [
                        "Assignment Marks",
                        selectedStudent.assignmentMarks,
                      ],
                      [
                        "Study Hours/Day",
                        selectedStudent.studyHoursPerDay,
                      ],
                      ["Backlogs", selectedStudent.backlogs],
                      [
                        "Participation",
                        selectedStudent.participationLevel,
                      ],
                    ].map(([label, value]) => (
                      <div className="info-row" key={label}>
                        <span className="info-label">{label}</span>
                        <span className="info-value">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="btn btn-primary w-full btn-lg"
                  onClick={handlePredict}
                  disabled={!selected || loadingPred}
                >
                  {loadingPred ? (
                    <>
                      <span className="loading-spinner" />
                      Predicting…
                    </>
                  ) : (
                    "🔮 Generate Prediction"
                  )}
                </button>
              </>
            )}
          </div>

          <div className="card">
            <h2 className="section-title">Prediction Result</h2>

            {!result ? (
              <div
                className="empty-state"
                style={{ padding: "60px 0" }}
              >
                <div className="empty-state-icon">🤖</div>
                <p>
                  Select a student and click "Generate Prediction"
                </p>
              </div>
            ) : (
              <div>
                <div
                  className="prediction-result-card"
                  style={{
                    background: catBg(result.performanceCategory),
                    marginBottom: 20,
                  }}
                >
                  <div
                    className="predicted-score"
                    style={{
                      color: catColor(result.performanceCategory),
                    }}
                  >
                    {result.predictedPercentage}%
                  </div>

                  <div
                    className="result-category"
                    style={{
                      background: catColor(result.performanceCategory),
                      color: "#fff",
                    }}
                  >
                    {result.performanceCategory}
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <div
                    className="section-title"
                    style={{ marginBottom: 8 }}
                  >
                    🎯 Recommendation
                  </div>

                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "var(--text-muted)",
                    }}
                  >
                    {result.recommendation}
                  </p>
                </div>

                <div
                  className="section-title"
                  style={{ marginBottom: 8 }}
                >
                  Performance Meter
                </div>

                <div className="perf-bar-wrap" style={{ height: 12 }}>
                  <div
                    className="perf-bar"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, Number(result.predictedPercentage) || 0)
                      )}%`,
                      background: catColor(result.performanceCategory),
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="card">
          {loadingList ? (
            <div className="loading-center">
              <div
                className="loading-spinner dark"
                style={{
                  width: 36,
                  height: 36,
                  borderWidth: 4,
                }}
              />
            </div>
          ) : predictions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No Predictions Yet</h3>
              <p>Run your first prediction to see results here</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Department</th>
                    <th>Predicted %</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {predictions.map((prediction) => (
                    <tr key={prediction._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {prediction.student?.name || "—"}
                        </div>

                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {prediction.student?.studentId || ""}
                        </div>
                      </td>

                      <td>
                        {prediction.student?.department || "—"}
                      </td>

                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: catColor(
                              prediction.performanceCategory
                            ),
                          }}
                        >
                          {prediction.predictedPercentage}%
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge badge-${catClass(
                            prediction.performanceCategory
                          )}`}
                        >
                          {prediction.performanceCategory}
                        </span>
                      </td>

                      <td
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {new Date(
                          prediction.predictionDate ||
                            prediction.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
