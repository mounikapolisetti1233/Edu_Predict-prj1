import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

/* Faculty */
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyLoginPage from "./pages/FacultyLoginPage";
import FacultyRegisterPage from "./pages/FacultyRegisterPage";

/* Student */
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

/* Common */
import HomePage from "./pages/HomePage";

/* Admin */
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegister from "./AdminRegister";
import AdminPage from "./pages/AdminPage";

/* Other pages */
import StudentsPage from "./pages/StudentsPage";
import PredictionsPage from "./pages/PredictionsPage";


const PAGE_TITLES = {
  "/dashboard": "Dashboard Overview",
  "/students": "Student Management",
  "/predictions": "Performance Predictions",
  "/admin": "Admin Dashboard",
};


function LayoutWrapper({ page, element }) {
  return (
    <DashboardLayout
      pageTitle={PAGE_TITLES[page] || "EduPredict"}
    >
      {element}
    </DashboardLayout>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>

          <Routes>

            {/* =================================================
                PUBLIC ROUTES
            ================================================= */}

            <Route
              path="/"
              element={<HomePage />}
            />

            {/* Student */}
            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={<RegisterPage />}
            />

            {/* Faculty */}
            <Route
              path="/faculty-login"
              element={<FacultyLoginPage />}
            />

            <Route
              path="/faculty-register"
              element={<FacultyRegisterPage />}
            />

            {/* Admin */}
            <Route
              path="/admin-login"
              element={<AdminLoginPage />}
            />

            <Route
              path="/admin-register"
              element={<AdminRegister />}
            />


            {/* =================================================
                STUDENT PROTECTED ROUTES
            ================================================= */}

            <Route element={<ProtectedRoute />}>

              <Route
                path="/dashboard"
                element={
                  <LayoutWrapper
                    page="/dashboard"
                    element={<DashboardPage />}
                  />
                }
              />

              <Route
                path="/predictions"
                element={
                  <LayoutWrapper
                    page="/predictions"
                    element={<PredictionsPage />}
                  />
                }
              />

            </Route>


            {/* =================================================
                FACULTY DASHBOARD
            ================================================= */}

            <Route
              element={
                <ProtectedRoute requireFaculty={true} />
              }
            >

              <Route
                path="/faculty"
                element={<FacultyDashboard />}
              />

            </Route>


            {/* =================================================
                FACULTY + ADMIN STUDENT MANAGEMENT
            ================================================= */}

            <Route
              element={
                <ProtectedRoute
                  allowRoles={["Faculty", "Admin"]}
                />
              }
            >

              <Route
                path="/students"
                element={
                  <LayoutWrapper
                    page="/students"
                    element={<StudentsPage />}
                  />
                }
              />

            </Route>


            {/* =================================================
                ADMIN DASHBOARD
            ================================================= */}

            <Route
              element={
                <ProtectedRoute requireAdmin={true} />
              }
            >

              <Route
                path="/admin"
                element={
                  <LayoutWrapper
                    page="/admin"
                    element={<AdminPage />}
                  />
                }
              />

            </Route>


            {/* =================================================
                FALLBACK
            ================================================= */}

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>

        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}