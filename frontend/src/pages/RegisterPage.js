import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../api/api';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
);
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

export default function RegisterPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const toast     = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState({});

  const update = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())            errs.name = 'Full name is required';
    if (!form.email.trim())           errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password)               errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword)        errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await authAPI.register({
        name:     form.name.trim(),
        email:    form.email.trim(),
        password: form.password,
      });

      login(
        { _id: data._id, name: data.name, email: data.email, role: data.role },
        data.token
      );
      toast.addToast(`Account created! Welcome, ${data.name} 🎉`, 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      if (err.response?.status === 400 && message.toLowerCase().includes('already exists')) {
        toast.addToast('An account with this email already exists. Please login.', 'warning');
        setErrors({ email: 'This email is already registered. Please login.' });
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

        <h2 className="auth-heading">Create your account</h2>
        <p className="auth-subheading">Join EduPredict to manage student performance predictions</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <UserIcon />
              <input
                id="name"
                type="text"
                className={`form-control${errors.name ? ' error' : ''}`}
                placeholder="John Doe"
                value={form.name}
                onChange={update('name')}
                autoFocus
              />
            </div>
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <MailIcon />
              <input
                id="email"
                type="email"
                className={`form-control${errors.email ? ' error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <LockIcon />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                className={`form-control${errors.password ? ' error' : ''}`}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={update('password')}
                autoComplete="new-password"
              />
              <button type="button" className="toggle-password" onClick={() => setShowPwd(v => !v)}>
                <EyeIcon off={showPwd} />
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Confirm Password <span className="required">*</span></label>
            <div className="input-icon-wrapper">
              <LockIcon />
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                className={`form-control${errors.confirmPassword ? ' error' : ''}`}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                autoComplete="new-password"
              />
              <button type="button" className="toggle-password" onClick={() => setShowConfirm(v => !v)}>
                <EyeIcon off={showConfirm} />
              </button>
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><span className="loading-spinner" /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-link">
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
