import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../api/api';

/* ── Icons ─────────────────────────────────────────────── */

const ShieldIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const MailIcon = () => (
  <svg
    className="input-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg
    className="input-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ off }) =>
  off ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!email.trim()) {
      errs.email = 'Admin Email / Username is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      errs.password = 'Password is required';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data } = await authAPI.login({
        email: email.trim(),
        password
      });

      if (data.role !== 'Admin') {
        toast.addToast(
          'Access Denied: You do not have administrator permissions.',
          'error'
        );

        setErrors({
          general:
            'Access Denied: Unauthenticated or non-admin user credentials.'
        });

        setLoading(false);
        return;
      }

      login(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        },
        data.token
      );

      toast.addToast(
        `Welcome Admin, ${data.name}! 🛡️`,
        'success'
      );

      navigate('/admin', { replace: true });

    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Invalid credentials. Please try again.';

      toast.addToast(message, 'error');

      setErrors({
        general: message
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-wrapper"
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%)'
      }}
    >
      <div
        className="auth-card"
        style={{
          borderTop: '4px solid #ef4444'
        }}
      >

        {/* Back to Home */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            marginBottom: 20
          }}
        >
          <ArrowLeftIcon />
          Back to Home
        </Link>

        {/* Logo Header */}
        <div
          className="auth-logo"
          style={{
            marginBottom: 24
          }}
        >
          <div
            className="auth-logo-icon"
            style={{
              background:
                'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff'
            }}
          >
            <ShieldIcon />
          </div>

          <div className="auth-logo-text">
            <h1 style={{ color: '#dc2626' }}>
              Admin Portal
            </h1>

            <p>
              AUTHORIZED PERSONNEL ONLY
            </p>
          </div>
        </div>

        {/* Heading */}
        <h2 className="auth-heading">
          System Administrator Sign In
        </h2>

        <p className="auth-subheading">
          Enter your administrator credentials to access the Admin Dashboard
        </p>

        {/* General Error */}
        {errors.general && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.85rem',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>
              ⚠️ {errors.general}
            </span>
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Admin Email */}
          <div className="form-group">
            <label
              className="form-label"
              htmlFor="admin-email"
            >
              Admin Email / Username{' '}
              <span className="required">*</span>
            </label>

            <div className="input-icon-wrapper">
              <MailIcon />

              <input
                id="admin-email"
                type="email"
                className={`form-control${
                  errors.email ? ' error' : ''
                }`}
                placeholder="admin@edupredict.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    email: '',
                    general: ''
                  }));
                }}
                autoComplete="email"
                autoFocus
              />
            </div>

            {errors.email && (
              <span className="form-error">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label
              className="form-label"
              htmlFor="admin-password"
            >
              Password{' '}
              <span className="required">*</span>
            </label>

            <div className="input-icon-wrapper">
              <LockIcon />

              <input
                id="admin-password"
                type={showPwd ? 'text' : 'password'}
                className={`form-control${
                  errors.password ? ' error' : ''
                }`}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    password: '',
                    general: ''
                  }));
                }}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowPwd((v) => !v)
                }
                aria-label={
                  showPwd
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                <EyeIcon off={showPwd} />
              </button>
            </div>

            {errors.password && (
              <span className="form-error">
                {errors.password}
              </span>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-danger btn-lg w-full"
            disabled={loading}
            style={{
              marginTop: 8
            }}
          >
            {loading ? (
              <>
                <span className="loading-spinner" />
                Authenticating Admin...
              </>
            ) : (
              'Admin Login'
            )}
          </button>
        </form>

        {/* Register Admin */}
        <p
          style={{
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 8,
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          New Administrator?{' '}
          <Link
            to="/admin-register"
            style={{
              color: '#dc2626',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Register Admin
          </Link>
        </p>

        {/* Student Login */}
        <p
          style={{
            textAlign: 'center',
            marginTop: 8,
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          Student or Educator?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--primary)',
              fontWeight: 600
            }}
          >
            Student Login
          </Link>
        </p>

      </div>
    </div>
  );
}