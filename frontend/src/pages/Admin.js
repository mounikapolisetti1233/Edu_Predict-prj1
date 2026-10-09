import React, { useState, useEffect, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  ShieldCheck,
  Users,
  Database,
  Trash2,
  AlertCircle,
  Activity,
  CheckCircle,
} from "lucide-react";

const Admin = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [resUsers, resStats] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/statistics"),
      ]);
      setUsers(resUsers.data);
      setStats(resStats.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setError(
        err.response?.data?.message || "Failed to load admin management control panel."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      setSuccessMsg("User account removed successfully.");
      setDeleteConfirmId(null);
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user account.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={28} color="#4f46e5" />
            Admin Control Panel & System Administration
          </h1>
          <p className="page-subtitle">
            User access control, database statistics monitoring, and system activity
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          Loading system administrative control data...
        </div>
      ) : (
        <>
          {/* Admin Database Statistics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}>
                <Users />
              </div>
              <div className="metric-info">
                <div className="val">{stats?.totalUsers || 0}</div>
                <div className="lbl">Registered Accounts</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#d1fae5", color: "#10b981" }}>
                <Database />
              </div>
              <div className="metric-info">
                <div className="val">{stats?.totalStudents || 0}</div>
                <div className="lbl">Student DB Records</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#dbeafe", color: "#0ea5e9" }}>
                <Activity />
              </div>
              <div className="metric-info">
                <div className="val">{stats?.totalPredictions || 0}</div>
                <div className="lbl">Predictions Processed</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
                <CheckCircle />
              </div>
              <div className="metric-info">
                <div className="val">Online</div>
                <div className="lbl">MongoDB Atlas Health</div>
              </div>
            </div>
          </div>

          {/* Registered Users Table */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
              User Account Management
            </h3>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                        No user accounts registered.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{u._id}</td>
                        <td style={{ fontWeight: 600, color: "#0f172a" }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.role === "Admin" ? "badge-excellent" : "badge-good"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.85rem", color: "#64748b" }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {u._id === currentUser._id ? (
                            <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontStyle: "italic" }}>
                              Current Admin
                            </span>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(u._id)}
                              className="btn btn-danger btn-sm"
                              title="Delete User Account"
                            >
                              <Trash2 size={15} />
                              <span>Delete</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete User Confirmation Modal */}
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
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Confirm User Deletion</h3>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "1.5rem" }}>
              Are you sure you want to permanently delete this user account from EduPredict?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleDeleteUser(deleteConfirmId)} className="btn btn-danger">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
