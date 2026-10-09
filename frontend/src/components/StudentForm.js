import React, { useState, useEffect } from "react";
import { User, BookOpen, AlertCircle, Save } from "lucide-react";

const StudentForm = ({ initialData, onSubmit, isEditing = false, loading = false }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    age: 20,
    gender: "Male",
    email: "",
    department: "Computer Science",
    semester: 1,
    previousPercentage: 75,
    attendancePercentage: 80,
    internalMarks: 70,
    assignmentMarks: 75,
    studyHoursPerDay: 4,
    backlogs: 0,
    participationLevel: "Medium",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Front-end validations
    if (!formData.studentId.trim() || !formData.name.trim() || !formData.email.trim()) {
      setError("Please fill in all basic required information fields.");
      return;
    }

    const prevPct = Number(formData.previousPercentage);
    const attPct = Number(formData.attendancePercentage);
    const intMrk = Number(formData.internalMarks);
    const assMrk = Number(formData.assignmentMarks);
    const hours = Number(formData.studyHoursPerDay);
    const back = Number(formData.backlogs);

    if (prevPct < 0 || prevPct > 100) {
      setError("Previous Percentage must be between 0 and 100.");
      return;
    }
    if (attPct < 0 || attPct > 100) {
      setError("Attendance Percentage must be between 0 and 100.");
      return;
    }
    if (intMrk < 0 || intMrk > 100) {
      setError("Internal Marks must be between 0 and 100.");
      return;
    }
    if (assMrk < 0 || assMrk > 100) {
      setError("Assignment Marks must be between 0 and 100.");
      return;
    }
    if (hours < 0 || hours > 24) {
      setError("Study Hours Per Day must be between 0 and 24.");
      return;
    }
    if (back < 0) {
      setError("Number of backlogs cannot be negative.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Personal Information */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#4f46e5" }}>
          <User size={20} />
          Personal & Academic Identity
        </h3>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Student ID *</label>
            <input
              type="text"
              name="studentId"
              className="form-input"
              placeholder="e.g. STU1001"
              value={formData.studentId}
              onChange={handleChange}
              disabled={isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="student@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              className="form-input"
              min="15"
              max="100"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              name="department"
              className="form-select"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Comm">Electronics & Comm</option>
              <option value="Mechanical Eng">Mechanical Eng</option>
              <option value="Civil Eng">Civil Eng</option>
              <option value="Business Admin">Business Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Current Semester</label>
            <input
              type="number"
              name="semester"
              className="form-input"
              min="1"
              max="12"
              value={formData.semester}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Academic Performance Indicators */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#0ea5e9" }}>
          <BookOpen size={20} />
          Academic Metrics & Study Behavior
        </h3>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Previous Semester % (0-100)</label>
            <input
              type="number"
              name="previousPercentage"
              className="form-input"
              min="0"
              max="100"
              step="0.1"
              value={formData.previousPercentage}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Attendance % (0-100)</label>
            <input
              type="number"
              name="attendancePercentage"
              className="form-input"
              min="0"
              max="100"
              step="0.1"
              value={formData.attendancePercentage}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Internal Marks % (0-100)</label>
            <input
              type="number"
              name="internalMarks"
              className="form-input"
              min="0"
              max="100"
              step="0.1"
              value={formData.internalMarks}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assignment Marks % (0-100)</label>
            <input
              type="number"
              name="assignmentMarks"
              className="form-input"
              min="0"
              max="100"
              step="0.1"
              value={formData.assignmentMarks}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Study Hours / Day (0-24)</label>
            <input
              type="number"
              name="studyHoursPerDay"
              className="form-input"
              min="0"
              max="24"
              step="0.5"
              value={formData.studyHoursPerDay}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Active Backlogs</label>
            <input
              type="number"
              name="backlogs"
              className="form-input"
              min="0"
              value={formData.backlogs}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Class Participation</label>
            <select
              name="participationLevel"
              className="form-select"
              value={formData.participationLevel}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Save size={18} />
          <span>{loading ? "Saving Record..." : isEditing ? "Update Student" : "Save Student Record"}</span>
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
