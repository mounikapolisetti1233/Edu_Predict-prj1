import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from './api/api';
import { useToast } from './context/ToastContext';

export default function AdminRegister() {
    const navigate = useNavigate();
    const toast = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        // Validation
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            setLoading(true);

            // Register Admin using the SAME authentication API
            const { data } = await authAPI.register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: password,
                role: 'Admin'
            });

            console.log('Admin registration successful:', data);

            toast.addToast(
                'Admin registration successful! Please login.',
                'success'
            );

            // Go to Admin Login after successful registration
            navigate('/admin-login', { replace: true });

        } catch (err) {
            console.error('Admin registration error:', err);

            const message =
                err.response?.data?.message ||
                'Admin registration failed. Please try again.';

            setError(message);

            toast.addToast(message, 'error');

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

                {/* Back */}
                <Link
                    to="/admin-login"
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
                    ← Back to Admin Login
                </Link>

                {/* Header */}
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
                        🛡️
                    </div>

                    <div className="auth-logo-text">
                        <h1 style={{ color: '#dc2626' }}>
                            Admin Portal
                        </h1>

                        <p>
                            ADMINISTRATION REGISTRATION
                        </p>
                    </div>
                </div>

                <h2 className="auth-heading">
                    Create Administrator Account
                </h2>

                <p className="auth-subheading">
                    Register a new administrator account for EduPredict
                </p>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            background: '#fee2e2',
                            border: '1px solid #fca5a5',
                            color: '#991b1b',
                            padding: '10px 14px',
                            borderRadius: 8,
                            marginBottom: 20,
                            fontSize: '0.85rem'
                        }}
                    >
                        ⚠️ {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    noValidate
                >

                    {/* Name */}
                    <div className="form-group">
                        <label className="form-label">
                            Admin Name <span className="required">*</span>
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter admin name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label">
                            Admin Email <span className="required">*</span>
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="admin@edupredict.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label">
                            Password <span className="required">*</span>
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Create password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label className="form-label">
                            Confirm Password <span className="required">*</span>
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Register */}
                    <button
                        type="submit"
                        className="btn btn-danger btn-lg w-full"
                        disabled={loading}
                        style={{
                            marginTop: 10
                        }}
                    >
                        {loading
                            ? 'Registering Admin...'
                            : 'Register Admin'}
                    </button>

                </form>

                {/* Login */}
                <p
                    style={{
                        textAlign: 'center',
                        marginTop: 20,
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)'
                    }}
                >
                    Already have an admin account?{' '}

                    <Link
                        to="/admin-login"
                        style={{
                            color: '#dc2626',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}
                    >
                        Admin Login
                    </Link>
                </p>

            </div>
        </div>
    );
}