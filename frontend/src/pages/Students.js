import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Search,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  BookOpen,
  X,
  AlertCircle,
} from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (departmentFilter) params.department = departmentFilter;

      const res = await API.get("/students", { params });
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch Students Error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, departmentFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/students/${id}`);
      setMessage("Student record deleted successfully.");
      setDeleteConfirmId(null);
      fetchStudents();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">Manage, view, and update registered student records</p>
        </div>

        <Link to="/students/add" className="btn btn-primary">
          <UserPlus size={18} />
          <span>Add New Student</span>
        </Link>
      </div>

      {message && (
        <div className="alert alert-success" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{message}</span>
          <button onClick={() => setMessage("")} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-box" style={{ flex: 1, minWidth: "240px" }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by Name, Student ID, or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: "200px" }}>
            <select
              className="form-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Data Science">Data Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Comm">Electronics & Comm</option>
              <option value="Mechanical Eng">Mechanical Eng</option>
              <option value="Civil Eng">Civil Eng</option>
              <option value="Business Admin">Business Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Sem</th>
                <th>Prev %</th>
                <th>Attendance</th>
                <th>Backlogs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                    Loading student directory...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    No students found. Click "Add New Student" to create a student record.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id}>
                    <td style={{ fontWeight: 700, color: "#4f46e5" }}>{student.studentId}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{student.name}</div>
                      <div style={{ fontSize: "0.775rem", color: "#64748b" }}>{student.email}</div>
                    </td>
                    <td>{student.department}</td>
                    <td>Sem {student.semester}</td>
                    <td>{student.previousPercentage}%</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: student.attendancePercentage < 75 ? "#ef4444" : "#10b981",
                        }}
                      >
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    <td>
                      {student.backlogs > 0 ? (
                        <span className="badge badge-at-risk">{student.backlogs} Active</span>
                      ) : (
                        <span className="badge badge-excellent">0</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="btn btn-secondary btn-sm"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/students/edit/${student._id}`)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Student"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(student._id)}
                          className="btn btn-danger btn-sm"
                          title="Delete Student"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Student Modal */}
      {selectedStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
        >
          <div className="card" style={{ maxWidth: "550px", width: "100%", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={22} color="#4f46e5" />
                Student Profile Details
              </h2>
              <button onClick={() => setSelectedStudent(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
              <div><strong>Student ID:</strong> {selectedStudent.studentId}</div>
              <div><strong>Name:</strong> {selectedStudent.name}</div>
              <div><strong>Email:</strong> {selectedStudent.email}</div>
              <div><strong>Department:</strong> {selectedStudent.department}</div>
              <div><strong>Semester:</strong> Semester {selectedStudent.semester}</div>
              <div><strong>Age / Gender:</strong> {selectedStudent.age} yrs / {selectedStudent.gender}</div>
              <div><strong>Previous Score:</strong> {selectedStudent.previousPercentage}%</div>
              <div><strong>Attendance:</strong> {selectedStudent.attendancePercentage}%</div>
              <div><strong>Internal Marks:</strong> {selectedStudent.internalMarks}%</div>
              <div><strong>Assignment Marks:</strong> {selectedStudent.assignmentMarks}%</div>
              <div><strong>Study Hours/Day:</strong> {selectedStudent.studyHoursPerDay} hrs</div>
              <div><strong>Active Backlogs:</strong> {selectedStudent.backlogs}</div>
              <div><strong>Participation:</strong> {selectedStudent.participationLevel}</div>
            </div>

            <div style={{ marginTop: "1.75rem", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedStudent(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
        >
          <div className="card" style={{ maxWidth: "420px", width: "100%", padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#ef4444", marginBottom: "1rem" }}>
              <AlertCircle size={24} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Confirm Delete</h3>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1.5rem" }}>
              Are you sure you want to delete this student record? This action will also delete all prediction history associated with this student.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="btn btn-danger">
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
