import React, { useState, useEffect, useMemo } from "react";
import { adminAPI, studentsAPI } from "../api/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ======================================================
// INLINE SVG ICONS
// ======================================================

const ShieldIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const StudentsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ======================================================
// STUDENT DETAILS MODAL
// ======================================================

function StudentDetailsModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #4f46e5, #06b6d4)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              {student.name?.[0]?.toUpperCase() || "S"}
            </div>

            <div>
              <h2 style={{ fontSize: "1.2rem", margin: 0 }}>
                {student.name}
              </h2>

              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                ID: {student.studentId || student._id}
              </span>
            </div>
          </div>

          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">Email Address</span>
              <span className="info-value">
                {student.email || "N/A"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">Department</span>
              <span className="info-value">
                {student.department || "N/A"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">Semester / Year</span>
              <span className="info-value">
                Semester {student.semester || "N/A"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">Gender / Age</span>
              <span className="info-value">
                {student.gender || "N/A"},{" "}
                {student.age ? `${student.age} yrs` : "N/A"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">
                Attendance Percentage
              </span>

              <span
                className="info-value"
                style={{
                  color:
                    student.attendancePercentage < 75
                      ? "var(--danger)"
                      : "var(--success)",
                }}
              >
                {student.attendancePercentage != null
                  ? `${student.attendancePercentage}%`
                  : "N/A"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">Previous Score</span>
              <span className="info-value">
                {student.previousPercentage != null
                  ? `${student.previousPercentage}%`
                  : "N/A"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">Internal Marks</span>
              <span className="info-value">
                {student.internalMarks != null
                  ? `${student.internalMarks}%`
                  : "N/A"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">Assignment Marks</span>
              <span className="info-value">
                {student.assignmentMarks != null
                  ? `${student.assignmentMarks}%`
                  : "N/A"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">
                Study Hours / Day
              </span>
              <span className="info-value">
                {student.studyHoursPerDay != null
                  ? `${student.studyHoursPerDay} hrs`
                  : "N/A"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">Active Backlogs</span>

              <span className="info-value">
                {student.backlogs > 0 ? (
                  <span className="badge badge-risk">
                    {student.backlogs} Backlog(s)
                  </span>
                ) : (
                  <span className="badge badge-excellent">
                    None
                  </span>
                )}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">
                Class Participation
              </span>

              <span className="info-value">
                {student.participationLevel || "Medium"}
              </span>
            </div>

            <div
              className="info-row"
              style={{
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span className="info-label">
                Registration Date
              </span>

              <span className="info-value">
                {student.createdAt
                  ? new Date(
                      student.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// ADMIN PAGE
// ======================================================

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  // Sorting
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const toast = useToast();

  const {
    user: currentUser,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  // ====================================================
  // FETCH ADMIN DATA
  // ====================================================

  const fetchData = async () => {
    setLoading(true);

    try {
      const [
        usersRes,
        statsRes,
        studentsRes,
      ] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStatistics(),
        studentsAPI.getAll(),
      ]);

      setUsers(usersRes.data || []);
      setStats(statsRes.data || null);
      setStudents(studentsRes.data || []);
    } catch (error) {
      console.error(
        "Failed to load admin data:",
        error
      );

      toast.addToast(
        "Failed to load admin data from server.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    logout();

    toast.addToast(
      "Admin logged out successfully.",
      "info"
    );

    navigate("/admin-login", {
      replace: true,
    });
  };

  // ====================================================
  // DELETE ADMIN
  // ====================================================

  const handleDeleteUser = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete account "${name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(id);

    try {
      await adminAPI.deleteUser(id);

      toast.addToast(
        `User ${name} deleted successfully.`,
        "success"
      );

      await fetchData();
    } catch (err) {
      toast.addToast(
        err.response?.data?.message ||
          "Failed to delete user.",
        "error"
      );
    } finally {
      setDeleting(null);
    }
  };

  // ====================================================
  // ADMIN USERS
  // ====================================================

  const adminUsers = useMemo(() => {
    return users.filter(
      (user) => user.role === "Admin"
    );
  }, [users]);

  // ====================================================
  // FILTER STUDENTS
  // ====================================================

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase();

      const matchesSearch =
        !query ||
        student.name
          ?.toLowerCase()
          .includes(query) ||
        student.email
          ?.toLowerCase()
          .includes(query) ||
        student.studentId
          ?.toLowerCase()
          .includes(query) ||
        student.department
          ?.toLowerCase()
          .includes(query);

      const matchesDepartment =
        !deptFilter ||
        student.department === deptFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );
    });
  }, [
    students,
    search,
    deptFilter,
  ]);

  // ====================================================
  // SORT STUDENTS
  // ====================================================

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort(
      (a, b) => {
        let valueA = a[sortField] || "";
        let valueB = b[sortField] || "";

        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
        }

        if (typeof valueB === "string") {
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) {
          return sortOrder === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
          return sortOrder === "asc" ? 1 : -1;
        }

        return 0;
      }
    );
  }, [
    filteredStudents,
    sortField,
    sortOrder,
  ]);

  // ====================================================
  // PAGINATION
  // ====================================================

  const totalPages =
    Math.ceil(
      sortedStudents.length /
        itemsPerPage
    ) || 1;

  const paginatedStudents = useMemo(() => {
    const start =
      (currentPage - 1) *
      itemsPerPage;

    return sortedStudents.slice(
      start,
      start + itemsPerPage
    );
  }, [
    sortedStudents,
    currentPage,
  ]);

  // ====================================================
  // SORT HANDLER
  // ====================================================

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((previous) =>
        previous === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="loading-center">
        <div
          className="loading-spinner dark"
          style={{
            width: 40,
            height: 40,
            borderWidth: 4,
          }}
        />
      </div>
    );
  }

  // ====================================================
  // DASHBOARD STATISTICS
  // ====================================================

  const totalStudentsCount =
    stats?.totalStudents ??
    students.length;

  const totalAdminsCount =
    users.filter(
      (user) => user.role === "Admin"
    ).length;

  const activeStudentsCount =
    students.filter(
      (student) =>
        (student.attendancePercentage ||
          0) >= 75
    ).length;

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <div>

      {/* ================================================
          ADMIN HEADER
      ================================================= */}

      <div
        className="card"
        style={{
          marginBottom: 24,
          padding: "20px 24px",
          background:
            "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background:
                  "linear-gradient(135deg, #ef4444, #dc2626)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow:
                  "0 4px 12px rgba(239,68,68,0.4)",
              }}
            >
              <ShieldIcon />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <h1
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    margin: 0,
                    color: "#fff",
                  }}
                >
                  {currentUser?.name ||
                    "Admin User"}
                </h1>

                <span
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 999,
                    textTransform:
                      "uppercase",
                  }}
                >
                  System Admin
                </span>
              </div>

              <p
                style={{
                  fontSize: "0.85rem",
                  color:
                    "rgba(255,255,255,0.7)",
                  margin: "2px 0 0",
                }}
              >
                {currentUser?.email ||
                  "admin@edupredict.com"}{" "}
                • Full Access Authorization
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </div>

      {/* ================================================
          STATISTICS
          
          TOTAL USERS REMOVED
      ================================================= */}

      <div
        className="stats-grid"
        style={{
          marginBottom: 28,
        }}
      >

        {/* Total Students */}
        <div className="stat-card blue">
          <div className="stat-icon">
            🎓
          </div>

          <div className="stat-info">
            <h3>
              {totalStudentsCount}
            </h3>

            <p>Total Students</p>
          </div>
        </div>

        {/* Total Admins */}
        <div className="stat-card red">
          <div className="stat-icon">
            🛡️
          </div>

          <div className="stat-info">
            <h3>
              {totalAdminsCount}
            </h3>

            <p>Total Admins</p>
          </div>
        </div>

        {/* Active Students */}
        <div className="stat-card green">
          <div className="stat-icon">
            ✅
          </div>

          <div className="stat-info">
            <h3>
              {activeStudentsCount}
            </h3>

            <p>
              Active Students
              (≥75% Att.)
            </p>
          </div>
        </div>

      </div>

      {/* ================================================
          NAVIGATION TABS
      ================================================= */}

      <div
        style={{
          display: "flex",
          borderBottom:
            "2px solid var(--border)",
          marginBottom: 24,
          gap: 8,
        }}
      >
        <button
          onClick={() =>
            setActiveTab("overview")
          }
          style={{
            padding: "12px 20px",
            border: "none",
            background: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            color:
              activeTab === "overview"
                ? "var(--primary)"
                : "var(--text-muted)",
            borderBottom:
              activeTab === "overview"
                ? "3px solid var(--primary)"
                : "3px solid transparent",
            marginBottom: -2,
          }}
        >
          📊 Dashboard Overview
        </button>

        <button
          onClick={() =>
            setActiveTab("students")
          }
          style={{
            padding: "12px 20px",
            border: "none",
            background: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            color:
              activeTab === "students"
                ? "var(--primary)"
                : "var(--text-muted)",
            borderBottom:
              activeTab === "students"
                ? "3px solid var(--primary)"
                : "3px solid transparent",
            marginBottom: -2,
          }}
        >
          👨‍🎓 Registered Students (
          {students.length})
        </button>

        <button
          onClick={() =>
            setActiveTab("admins")
          }
          style={{
            padding: "12px 20px",
            border: "none",
            background: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            color:
              activeTab === "admins"
                ? "var(--primary)"
                : "var(--text-muted)",
            borderBottom:
              activeTab === "admins"
                ? "3px solid var(--primary)"
                : "3px solid transparent",
            marginBottom: -2,
          }}
        >
          🛡️ Admins List (
          {adminUsers.length})
        </button>
      </div>

      {/* ================================================
          TAB 1 - OVERVIEW
      ================================================= */}

      {activeTab === "overview" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {stats?.categoryBreakdown && (
            <div className="card">
              <h2 className="section-title">
                Performance Category
                Breakdown
              </h2>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                {Object.entries(
                  stats.categoryBreakdown
                ).map(
                  ([category, count]) => {
                    const colorMap = {
                      Excellent:
                        "#10b981",
                      Good: "#4f46e5",
                      Average:
                        "#f59e0b",
                      "Needs Improvement":
                        "#f97316",
                      "At Risk":
                        "#ef4444",
                    };

                    const bgMap = {
                      Excellent:
                        "#d1fae5",
                      Good: "#ede9fe",
                      Average:
                        "#fef3c7",
                      "Needs Improvement":
                        "#fed7aa",
                      "At Risk":
                        "#fee2e2",
                    };

                    return (
                      <div
                        key={category}
                        style={{
                          background:
                            bgMap[
                              category
                            ] ||
                            "#f1f5f9",
                          border: `2px solid ${
                            colorMap[
                              category
                            ] ||
                            "#94a3b8"
                          }`,
                          borderRadius: 12,
                          padding:
                            "16px 24px",
                          flex: 1,
                          minWidth: 140,
                          textAlign:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize:
                              "1.8rem",
                            fontWeight: 800,
                            color:
                              colorMap[
                                category
                              ],
                          }}
                        >
                          {count}
                        </div>

                        <div
                          style={{
                            fontSize:
                              "0.8rem",
                            fontWeight: 700,
                            color:
                              colorMap[
                                category
                              ],
                          }}
                        >
                          {category}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="section-title">
              Quick Administration
              Actions
            </h2>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() =>
                  setActiveTab("students")
                }
              >
                <StudentsIcon />
                View All Students
              </button>

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setActiveTab("admins")
                }
              >
                <ShieldIcon />
                View Admin Accounts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================
          TAB 2 - STUDENTS
      ================================================= */}

      {activeTab === "students" && (
        <div>

          {/* Search and Filters */}
          <div
            className="card"
            style={{
              marginBottom: 20,
              padding: "16px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent:
                  "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems:
                    "center",
                }}
              >
                <div className="search-wrapper">
                  <SearchIcon />

                  <input
                    className="search-input"
                    placeholder="Search name, ID, email..."
                    value={search}
                    onChange={(e) => {
                      setSearch(
                        e.target.value
                      );
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <select
                  className="form-control"
                  style={{ width: 180 }}
                  value={deptFilter}
                  onChange={(e) => {
                    setDeptFilter(
                      e.target.value
                    );
                    setCurrentPage(1);
                  }}
                >
                  <option value="">
                    All Departments
                  </option>

                  <option value="Computer Science">
                    Computer Science
                  </option>

                  <option value="Data Science">
                    Data Science
                  </option>

                  <option value="Information Technology">
                    Information Technology
                  </option>

                  <option value="Electronics & Comm">
                    Electronics & Comm
                  </option>
                </select>

                {(search ||
                  deptFilter) && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSearch("");
                      setDeptFilter("");
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <span
                style={{
                  fontSize: "0.85rem",
                  color:
                    "var(--text-muted)",
                }}
              >
                Showing{" "}
                {sortedStudents.length}{" "}
                student(s)
              </span>
            </div>
          </div>

          {/* Student Table */}

          {paginatedStudents.length ===
          0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">
                  👨‍🎓
                </div>

                <h3>
                  No Student Records
                  Found
                </h3>

                <p>
                  Try adjusting your
                  search query or
                  department filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th
                      onClick={() =>
                        toggleSort(
                          "studentId"
                        )
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >
                      Student ID{" "}
                      {sortField ===
                      "studentId"
                        ? sortOrder ===
                          "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>

                    <th
                      onClick={() =>
                        toggleSort(
                          "name"
                        )
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >
                      Name{" "}
                      {sortField ===
                      "name"
                        ? sortOrder ===
                          "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>

                    <th>Email</th>

                    <th
                      onClick={() =>
                        toggleSort(
                          "department"
                        )
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >
                      Department{" "}
                      {sortField ===
                      "department"
                        ? sortOrder ===
                          "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>

                    <th>Semester</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedStudents.map(
                    (student) => (
                      <tr
                        key={
                          student._id
                        }
                      >
                        <td
                          style={{
                            fontWeight: 700,
                            color:
                              "var(--primary)",
                          }}
                        >
                          {student.studentId ||
                            "N/A"}
                        </td>

                        <td>
                          <div
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {student.name}
                          </div>
                        </td>

                        <td
                          style={{
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          {student.email}
                        </td>

                        <td>
                          {student.department ||
                            "N/A"}
                        </td>

                        <td>
                          Semester{" "}
                          {student.semester ||
                            1}
                        </td>

                        <td>
                          {(student.attendancePercentage ||
                            0) >= 75 ? (
                            <span className="badge badge-excellent">
                              Active
                            </span>
                          ) : (
                            <span className="badge badge-risk">
                              At Risk
                            </span>
                          )}
                        </td>

                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setSelectedStudent(
                                student
                              )
                            }
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap: 4,
                            }}
                          >
                            <EyeIcon />
                            View Details
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                gap: 12,
                marginTop: 20,
              }}
            >
              <button
                className="btn btn-secondary btn-sm"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        page - 1,
                        1
                      )
                  )
                }
              >
                ◀ Previous
              </button>

              <span
                style={{
                  fontSize:
                    "0.85rem",
                  fontWeight: 600,
                }}
              >
                Page {currentPage} of{" "}
                {totalPages}
              </span>

              <button
                className="btn btn-secondary btn-sm"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        page + 1,
                        totalPages
                      )
                  )
                }
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================================================
          TAB 3 - ADMINS
      ================================================= */}

      {activeTab === "admins" && (
        <div className="card">
          <h2 className="section-title">
            Authorized Administrators (
            {adminUsers.length})
          </h2>

          {adminUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                🛡️
              </div>

              <h3>No Admins Found</h3>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Admin ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {adminUsers.map(
                    (admin) => (
                      <tr
                        key={admin._id}
                      >
                        <td
                          style={{
                            fontFamily:
                              "monospace",
                            fontSize:
                              "0.8rem",
                            color:
                              "var(--text-muted)",
                          }}
                        >
                          {admin._id}
                        </td>

                        <td>
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius:
                                  "50%",
                                background:
                                  "linear-gradient(135deg,#ef4444,#dc2626)",
                                color:
                                  "#fff",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontWeight: 700,
                                fontSize:
                                  "0.85rem",
                              }}
                            >
                              {admin.name?.[0]?.toUpperCase() ||
                                "A"}
                            </div>

                            <span
                              style={{
                                fontWeight:
                                  600,
                              }}
                            >
                              {admin.name}
                            </span>

                            {admin._id ===
                              currentUser?._id && (
                              <span
                                className="badge badge-admin"
                                style={{
                                  fontSize:
                                    "0.65rem",
                                }}
                              >
                                You
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          {admin.email}
                        </td>

                        <td>
                          <span className="badge badge-admin">
                            {admin.role}
                          </span>
                        </td>

                        <td>
                          <span className="badge badge-excellent">
                            Active
                          </span>
                        </td>

                        <td
                          style={{
                            color:
                              "var(--text-muted)",
                            fontSize:
                              "0.8rem",
                          }}
                        >
                          {admin.createdAt
                            ? new Date(
                                admin.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td>
                          {admin._id !==
                          currentUser?._id ? (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleDeleteUser(
                                  admin._id,
                                  admin.name
                                )
                              }
                              disabled={
                                deleting ===
                                admin._id
                              }
                            >
                              {deleting ===
                              admin._id
                                ? "..."
                                : "Remove"}
                            </button>
                          ) : (
                            <span
                              style={{
                                fontSize:
                                  "0.8rem",
                                color:
                                  "var(--text-muted)",
                              }}
                            >
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================================================
          STUDENT DETAILS MODAL
      ================================================= */}

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() =>
            setSelectedStudent(null)
          }
        />
      )}
    </div>
  );
}