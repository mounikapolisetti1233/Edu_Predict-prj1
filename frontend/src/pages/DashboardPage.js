import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentsAPI, predictionsAPI, adminAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#10b981', '#4f46e5', '#f59e0b', '#f97316', '#ef4444'];

const categoryColor = (cat) => {
  if (!cat) return '#94a3b8';
  const map = { Excellent: '#10b981', Good: '#4f46e5', Average: '#f59e0b', 'Needs Improvement': '#f97316', 'At Risk': '#ef4444' };
  return map[cat] || '#94a3b8';
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats,       setStats]       = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [students,    setStudents]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [studRes, predRes] = await Promise.all([
          studentsAPI.getAll(),
          predictionsAPI.getAll(),
        ]);
        setStudents(studRes.data);
        setPredictions(predRes.data);

        if (user?.role === 'Admin') {
          const adminRes = await adminAPI.getStatistics();
          setStats(adminRes.data);
        }
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  // Build chart data from predictions
  const categoryMap = {};
  predictions.forEach(p => {
    const cat = p.performanceCategory;
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Dept bar chart from students
  const deptMap = {};
  students.forEach(s => { deptMap[s.department] = (deptMap[s.department] || 0) + 1; });
  const barData = Object.entries(deptMap).map(([dept, count]) => ({ dept, count }));

  const totalStudents = students.length;
  const totalPredictions = predictions.length;
  const atRisk = predictions.filter(p => p.performanceCategory === 'At Risk').length;
  const excellent = predictions.filter(p => p.performanceCategory === 'Excellent').length;

  if (loading) {
    return (
      <div className="loading-center">
        <div className="loading-spinner dark" style={{ width: 36, height: 36, borderWidth: 4 }} />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
          Here's an overview of the EduPredict system
        </p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{totalPredictions}</h3>
            <p>Predictions Run</p>
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">🌟</div>
          <div className="stat-info">
            <h3>{excellent}</h3>
            <p>Excellent Students</p>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{atRisk}</h3>
            <p>At-Risk Students</p>
          </div>
        </div>
        {user?.role === 'Admin' && stats && (
          <div className="stat-card cyan">
            <div className="stat-icon">🔐</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>System Users</p>
            </div>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Performance Pie */}
        <div className="card">
          <h2 className="section-title">Performance Distribution</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={categoryColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="empty-state-icon">📊</div>
              <p>No prediction data yet</p>
            </div>
          )}
        </div>

        {/* Department Bar */}
        <div className="card">
          <h2 className="section-title">Students by Department</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <div className="empty-state-icon">🏫</div>
              <p>No student data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Predictions</h2>
          <Link to="/predictions" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {predictions.length > 0 ? (
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
                {predictions.slice(0, 8).map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.student?.name || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.student?.studentId}</div>
                    </td>
                    <td>{p.student?.department || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: categoryColor(p.performanceCategory) }}>
                          {p.predictedPercentage}%
                        </span>
                        <div className="perf-bar-wrap" style={{ width: 60 }}>
                          <div className="perf-bar" style={{ width: `${p.predictedPercentage}%`, background: categoryColor(p.performanceCategory) }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${p.performanceCategory?.toLowerCase().replace(/\s+/g, '-')?.replace('needs-improvement','needs')?.replace('at-risk','risk')}`}>
                        {p.performanceCategory}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(p.predictionDate || p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📈</div>
            <h3>No Predictions Yet</h3>
            <p>Add students and run predictions to see results here</p>
            <Link to="/students" className="btn btn-primary" style={{ marginTop: 16 }}>Add Students</Link>
          </div>
        )}
      </div>
    </div>
  );
}
