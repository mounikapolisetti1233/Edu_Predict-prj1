import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ── Inline SVG Icons ─────────────────────────────────── */

const ChartIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="28"
    height="28"
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

const UsersIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BrainIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
  </svg>
);

const MenuIcon = () => (
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
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowRightIcon = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* ── Navbar ──────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}
      >

        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            🎓
          </div>

          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#1e293b',
            }}
          >
            EduPredict
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
          className="home-nav-desktop"
        >
          <a
            href="#home"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#64748b',
              textDecoration: 'none',
            }}
          >
            Home
          </a>

          <a
            href="#about"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#64748b',
              textDecoration: 'none',
            }}
          >
            About
          </a>

          <a
            href="#features"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#64748b',
              textDecoration: 'none',
            }}
          >
            Features
          </a>

          <Link
            to="/login"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#4f46e5',
              textDecoration: 'none',
            }}
          >
            Student Login
          </Link>

          <Link
            to="/faculty-login"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#2563eb',
              textDecoration: 'none',
            }}
          >
            Faculty / Mentor
          </Link>

          <Link
            to="/admin-login"
            className="btn btn-primary btn-sm"
            style={{ textDecoration: 'none' }}
          >
            Admin Login
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="home-nav-mobile-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1e293b',
            display: 'none',
          }}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 99,
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              borderBottom: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#1e293b',
                textDecoration: 'none',
                padding: '8px 0',
              }}
            >
              Home
            </a>

            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#1e293b',
                textDecoration: 'none',
                padding: '8px 0',
              }}
            >
              About
            </a>

            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#1e293b',
                textDecoration: 'none',
                padding: '8px 0',
              }}
            >
              Features
            </a>

            <Link
              to="/login"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#4f46e5',
                textDecoration: 'none',
                padding: '8px 0',
              }}
            >
              Student Login
            </Link>

            <Link
              to="/faculty-login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#2563eb',
                textDecoration: 'none',
                padding: '8px 0',
              }}
            >
              👨‍🏫 Faculty / Mentor Login
            </Link>

            <Link
              to="/faculty-register"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#2563eb',
                textDecoration: 'none',
                padding: '8px 0',
              }}
            >
              Faculty / Mentor Registration
            </Link>

            <Link
              to="/admin-login"
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#dc2626',
                textDecoration: 'none',
                padding: '8px 0',
              }}
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero Section ───────────────────────────────── */}
      <section
        id="home"
        style={{
          background:
            'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
          color: '#fff',
          padding: '80px 24px 100px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 800,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.12)',
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: 24,
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            🎓 AI-Powered Student Performance System
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Predict. Analyze.
            <br />
            <span
              style={{
                background:
                  'linear-gradient(90deg, #a5b4fc, #67e8f9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Empower Students.
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              opacity: 0.85,
              maxWidth: 560,
              margin: '0 auto 36px',
            }}
          >
            EduPredict uses data-driven insights to predict student academic
            performance, identify at-risk students, and provide actionable
            recommendations for educators and students.
          </p>

          {/* Main Login Options */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Student */}
            <Link
              to="/login"
              className="btn btn-lg"
              style={{
                background: '#fff',
                color: '#4f46e5',
                fontWeight: 700,
                padding: '14px 28px',
                borderRadius: 10,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              🎓 Student Login <ArrowRightIcon />
            </Link>

            {/* Faculty / Mentor */}
            <Link
              to="/faculty-login"
              className="btn btn-lg"
              style={{
                background: '#2563eb',
                color: '#fff',
                fontWeight: 700,
                padding: '14px 28px',
                borderRadius: 10,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              👨‍🏫 Faculty / Mentor Login
              <ArrowRightIcon />
            </Link>

            {/* Admin */}
            <Link
              to="/admin-login"
              className="btn btn-lg"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                fontWeight: 600,
                padding: '14px 28px',
                borderRadius: 10,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <ShieldIcon /> Admin Login
            </Link>
          </div>

          {/* Faculty Registration Link */}
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              justifyContent: 'center',
              gap: 18,
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/faculty-register"
              style={{
                color: '#bfdbfe',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              New Faculty / Mentor? Register Here →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Section ───────────────────────────── */}
      <section
        id="features"
        style={{
          padding: '80px 24px',
          background: '#f8fafc',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#1e293b',
              marginBottom: 12,
            }}
          >
            Key Features
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: '0 auto 48px',
              maxWidth: 500,
            }}
          >
            Everything you need to track and improve student academic
            performance
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24,
            }}
          >
            {[
              {
                icon: <BrainIcon />,
                title: 'AI Performance Prediction',
                desc: 'Advanced algorithms analyze academic data to predict student grades and identify performance trends.',
                color: '#4f46e5',
                bg: '#eef2ff',
              },
              {
                icon: <UsersIcon />,
                title: 'Student Management',
                desc: 'Complete student records with academic metrics, attendance tracking, and department-wise organization.',
                color: '#059669',
                bg: '#ecfdf5',
              },
              {
                icon: <ChartIcon />,
                title: 'Analytics Dashboard',
                desc: 'Visual dashboards with statistics, charts, and real-time data to help administrators make informed decisions.',
                color: '#d97706',
                bg: '#fffbeb',
              },
              {
                icon: <ShieldIcon />,
                title: 'Secure Admin Panel',
                desc: 'Role-based access control ensures only authorized administrators can manage student data and system settings.',
                color: '#dc2626',
                bg: '#fef2f2',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: feature.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>

                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#1e293b',
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    lineHeight: 1.7,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ──────────────────────────────── */}
      <section
        id="about"
        style={{
          padding: '80px 24px',
          background: '#fff',
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: 48,
            }}
          >
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#1e293b',
                marginBottom: 12,
              }}
            >
              About EduPredict
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#64748b',
                maxWidth: 600,
                margin: '0 auto',
              }}
            >
              A comprehensive college project built to revolutionize how
              educators track and predict student performance.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 24,
            }}
          >
            <div
              style={{
                background: '#f8fafc',
                borderRadius: 16,
                padding: 28,
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>
                🎯
              </div>

              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: 8,
                }}
              >
                Our Mission
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: 1.7,
                }}
              >
                To provide educators with data-driven tools that help
                identify students who need support, enabling proactive
                intervention before it's too late.
              </p>
            </div>

            <div
              style={{
                background: '#f8fafc',
                borderRadius: 16,
                padding: 28,
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>
                💻
              </div>

              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: 8,
                }}
              >
                Technology Stack
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: 1.7,
                }}
              >
                Built with React.js for the frontend, Node.js & Express
                for the backend, and MongoDB for the database — a full
                MERN stack application.
              </p>
            </div>

            <div
              style={{
                background: '#f8fafc',
                borderRadius: 16,
                padding: 28,
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>
                🔒
              </div>

              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: 8,
                }}
              >
                Security First
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: 1.7,
                }}
              >
                JWT-based authentication, bcrypt password hashing,
                role-based access control, and protected API routes ensure
                your data stays secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)',
          padding: '60px 24px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <h2
          style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          Ready to Get Started?
        </h2>

        <p
          style={{
            fontSize: '0.95rem',
            opacity: 0.85,
            marginBottom: 28,
            maxWidth: 500,
            margin: '0 auto 28px',
          }}
        >
          Sign in as a student, faculty/mentor, or administrator to access
          the EduPredict system.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/register"
            className="btn btn-lg"
            style={{
              background: '#fff',
              color: '#4f46e5',
              fontWeight: 700,
              padding: '12px 28px',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            Register as Student
          </Link>

          <Link
            to="/faculty-register"
            className="btn btn-lg"
            style={{
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              padding: '12px 28px',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            👨‍🏫 Register as Faculty
          </Link>

          <Link
            to="/admin-login"
            className="btn btn-lg"
            style={{
              background: 'transparent',
              color: '#fff',
              fontWeight: 600,
              padding: '12px 28px',
              borderRadius: 10,
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.4)',
            }}
          >
            Admin Portal
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer
        style={{
          background: '#0f172a',
          color: 'rgba(255,255,255,0.5)',
          padding: '32px 24px',
          textAlign: 'center',
          fontSize: '0.8rem',
        }}
      >
        <p>
          © 2026 EduPredict — AI-Powered Student Performance Prediction
          System
        </p>

        <p style={{ marginTop: 4 }}>
          Built as a College Project • MERN Stack
        </p>
      </footer>

      {/* ── Responsive Styles ──────────────────────────── */}
      <style>{`
        .home-nav-desktop {
          display: flex !important;
        }

        .home-nav-mobile-btn {
          display: none !important;
        }

        @media (max-width: 768px) {
          .home-nav-desktop {
            display: none !important;
          }

          .home-nav-mobile-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}