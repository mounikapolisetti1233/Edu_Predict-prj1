import React, { useState, useEffect, useCallback } from 'react';
import { studentsAPI } from '../api/api';
import { useToast } from '../context/ToastContext';

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology', 'Chemical', 'Electrical', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];
const PARTICIPATION = ['Low', 'Medium', 'High'];

const defaultForm = {
  studentId: '', name: '', age: '', gender: '', email: '', department: '',
  semester: '', previousPercentage: '', attendancePercentage: '', internalMarks: '',
  assignmentMarks: '', studyHoursPerDay: '', backlogs: '', participationLevel: 'Medium',
};

function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState(student ? { ...student } : { ...defaultForm });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const update = (k) => (e) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }));
    setErrors(prev => ({ ...prev, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.studentId.trim()) errs.studentId = 'Student ID required';
    if (!form.name.trim())      errs.name = 'Name required';
    if (!form.age)              errs.age = 'Age required';
    if (!form.gender)           errs.gender = 'Gender required';
    if (!form.email.trim())     errs.email = 'Email required';
    if (!form.department.trim()) errs.department = 'Department required';
    if (!form.semester)         errs.semester = 'Semester required';
    if (form.previousPercentage === '') errs.previousPercentage = 'Required';
    if (form.attendancePercentage === '') errs.attendancePercentage = 'Required';
    if (form.internalMarks === '') errs.internalMarks = 'Required';
    if (form.assignmentMarks === '') errs.assignmentMarks = 'Required';
    if (form.studyHoursPerDay === '') errs.studyHoursPerDay = 'Required';
    if (form.backlogs === '') errs.backlogs = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (student) {
        await studentsAPI.update(student._id, form);
        toast.addToast('Student updated successfully!', 'success');
      } else {
        await studentsAPI.create(form);
        toast.addToast('Student added successfully!', 'success');
      }
      onSave();
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to save student.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text', required = true) => (
    <div className="form-group">
      <label className="form-label">{label}{required && <span className="required"> *</span>}</label>
      <input
        type={type}
        className={`form-control${errors[key] ? ' error' : ''}`}
        value={form[key]}
        onChange={update(key)}
        min={type === 'number' ? 0 : undefined}
      />
      {errors[key] && <span className="form-error">{errors[key]}</span>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              {field('Student ID', 'studentId')}
              {field('Full Name', 'name')}
              {field('Age', 'age', 'number')}
              <div className="form-group">
                <label className="form-label">Gender <span className="required">*</span></label>
                <select className={`form-control${errors.gender ? ' error' : ''}`} value={form.gender} onChange={update('gender')}>
                  <option value="">Select gender</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.gender && <span className="form-error">{errors.gender}</span>}
              </div>
              {field('Email', 'email', 'email')}
              <div className="form-group">
                <label className="form-label">Department <span className="required">*</span></label>
                <select className={`form-control${errors.department ? ' error' : ''}`} value={form.department} onChange={update('department')}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <span className="form-error">{errors.department}</span>}
              </div>
              {field('Semester (1-12)', 'semester', 'number')}
              {field('Previous %', 'previousPercentage', 'number')}
              {field('Attendance %', 'attendancePercentage', 'number')}
              {field('Internal Marks', 'internalMarks', 'number')}
              {field('Assignment Marks', 'assignmentMarks', 'number')}
              {field('Study Hours/Day', 'studyHoursPerDay', 'number')}
              {field('Backlogs', 'backlogs', 'number')}
              <div className="form-group">
                <label className="form-label">Participation Level</label>
                <select className="form-control" value={form.participationLevel} onChange={update('participationLevel')}>
                  {PARTICIPATION.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="loading-spinner" /> Saving…</> : (student ? 'Update Student' : 'Add Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [dept,     setDept]     = useState('');
  const [modal,    setModal]    = useState(null); // null | 'add' | student-obj
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (dept)   params.department = dept;
      const { data } = await studentsAPI.getAll(params);
      setStudents(data);
    } catch { toast.addToast('Failed to fetch students.', 'error'); }
    finally   { setLoading(false); }
  }, [search, dept, toast]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student and all related predictions?')) return;
    setDeleting(id);
    try {
      await studentsAPI.delete(id);
      toast.addToast('Student deleted successfully.', 'success');
      fetchStudents();
    } catch (err) {
      toast.addToast(err.response?.data?.message || 'Failed to delete student.', 'error');
    } finally { setDeleting(null); }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p>{students.length} student{students.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('add')}>
          + Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="search-input"
              placeholder="Search students…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="form-control" style={{ width: 200 }} value={dept} onChange={e => setDept(e.target.value)}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {(search || dept) && (
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setDept(''); }}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-center"><div className="loading-spinner dark" style={{ width: 36, height: 36, borderWidth: 4 }} /></div>
      ) : students.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">👨‍🎓</div>
            <h3>No Students Found</h3>
            <p>Add your first student to get started</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setModal('add')}>Add Student</button>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Attendance %</th>
                <th>Previous %</th>
                <th>Backlogs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.studentId} · {s.email}</div>
                  </td>
                  <td>{s.department}</td>
                  <td>{s.semester}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, color: s.attendancePercentage < 75 ? 'var(--danger)' : 'var(--success)' }}>
                        {s.attendancePercentage}%
                      </span>
                    </div>
                  </td>
                  <td>{s.previousPercentage}%</td>
                  <td>
                    {s.backlogs > 0
                      ? <span className="badge badge-risk">{s.backlogs}</span>
                      : <span className="badge badge-excellent">0</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setModal(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)} disabled={deleting === s._id}>
                        {deleting === s._id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <StudentModal
          student={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetchStudents(); }}
        />
      )}
    </div>
  );
}
