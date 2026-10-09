import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import StudentForm from "../components/StudentForm";
import { UserPlus, ArrowLeft } from "lucide-react";

const AddStudent = () => {
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!isEditing) return;

    const fetchStudentDetails = async () => {
      try {
        setFetchLoading(true);
        const res = await API.get(`/students/${id}`);
        setInitialData(res.data);
      } catch (err) {
        setServerError("Failed to load student record.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id, isEditing]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setServerError("");

    try {
      if (isEditing) {
        await API.put(`/students/${id}`, formData);
      } else {
        await API.post("/students", formData);
      }
      navigate("/students");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to save student record. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: "0.75rem" }}
          >
            <ArrowLeft size={16} />
            <span>Back to Directory</span>
          </button>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserPlus size={28} color="#4f46e5" />
            {isEditing ? "Edit Student Details" : "Register New Student"}
          </h1>
          <p className="page-subtitle">
            Enter accurate academic and behavioral indicators for performance tracking
          </p>
        </div>
      </div>

      {serverError && (
        <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>
          {serverError}
        </div>
      )}

      {fetchLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          Loading student details...
        </div>
      ) : (
        <StudentForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isEditing={isEditing}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AddStudent;
