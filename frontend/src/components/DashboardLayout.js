import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const StudentsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const PredIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const AdminIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const navItems = [
  { label: 'Dashboard',   to: '/dashboard',  icon: <HomeIcon /> },
  { label: 'Students',    to: '/students',   icon: <StudentsIcon /> },
  { label: 'Predictions', to: '/predictions', icon: <PredIcon /> },
];

export default function DashboardLayout({ children, pageTitle }) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleLogout = () => {
    const isAdminUser = user?.role === 'Admin';
    logout();
    toast.addToast('You have been signed out.', 'info');
    navigate(isAdminUser ? '/admin-login' : '/login', { replace: true });
  };

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="sidebar">
        <Link to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <div className="sidebar-logo-text">
            <h2>EduPredict</h2>
            <p>AI PERFORMANCE SYSTEM</p>
          </div>
        </Link>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Main Menu</span>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item${location.pathname === item.to ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {user?.role === 'Admin' && (
            <>
              <span className="nav-section-label" style={{ marginTop: 8 }}>Administration</span>
              <Link
                to="/admin"
                className={`nav-item${location.pathname === '/admin' ? ' active' : ''}`}
              >
                <AdminIcon />
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar-user-info">
              <p>{user?.name || 'User'}</p>
              <span>{user?.role || 'User'}</span>
            </div>
          </div>
          <button className="nav-item" onClick={handleLogout} style={{ width: '100%', color: '#fca5a5' }}>
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────── */}
      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{pageTitle}</span>
          <div className="topbar-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ display: 'none' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
