import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../api/api';

/* ── SVG Icons ─────────────────────────────────────────── */
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function LoginPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const toast     = useToast();

  // ── State – starts EMPTY (requirement 1) ─────────────────
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  /* ── Validation ─────────────────────────────────────────── */
  const validate = () => {
    const errs = {};
    if (!email.trim())    errs.email    = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!password.trim()) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ─────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data } = await authAPI.login({ email: email.trim(), password });

      // Successful login → store user + token, navigate to Dashboard
      login(
        { _id: data._id, name: data.name, email: data.email, role: data.role },
        data.token
      );
      toast.addToast(`Welcome back, ${data.name}! 🎉`, 'success');
      navigate('/dashboard', { replace: true });

    } catch (err) {
      const status  = err.response?.status;
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      const code    = err.response?.data?.code;

      if (status === 401) {
        if (code === 'USER_NOT_FOUND' || message === 'Please register first') {
          // Account does not exist → tell user to register (Requirement 2)
          toast.addToast('Please register first. No account found with this email.', 'error');
          setErrors({ email: 'No account found. Please register first.' });
        } else {
          // Wrong password
          toast.addToast('Invalid email or password. Please try again.', 'error');
          setErrors({ password: 'Incorrect password. Please try again.' });
        }
      } else if (status === 400) {
        toast.addToast(message, 'warning');
      } else if (!err.response) {
        toast.addToast('Cannot connect to server. Please check your connection.', 'error');
      } else {
        toast.addToast(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <div className="auth-logo-text">
            <h1>EduPredict</h1>
            <p>AI-POWERED PERFORMANCE PREDICTOR</p>
          </div>
        </div>

        <h2 className="auth-heading">Sign in to your account</h2>
        <p className="auth-subheading">Enter your credentials to access the dashboard</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <div className="input-icon-wrapper">
              <MailIcon />
              <input
                id="email"
                type="email"
                className={`form-control${errors.email ? ' error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                autoComplete="email"
                autoFocus
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="input-icon-wrapper">
              <LockIcon />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                className={`form-control${errors.password ? ' error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                <EyeIcon off={showPwd} />
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            style={{ marginTop: 4 }}
          >
            {loading ? (
              <><span className="loading-spinner" /> Signing in…</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Register link – requirement 3 */}
        <p className="auth-footer-link">
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
