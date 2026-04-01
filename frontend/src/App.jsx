import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Lazy load — Patient
const PatientDashboard = lazy(() => import('./components/Dashboard/PatientDashboard'));
const PatientQuestionnaire = lazy(() => import('./components/PreOp/PatientQuestionnaire'));
const AirwayEvaluation = lazy(() => import('./components/PreOp/AirwayEvaluation'));

// Lazy load — Doctor
const DoctorDashboard = lazy(() => import('./components/Dashboard/DoctorDashboard'));
const PreOpModule = lazy(() => import('./components/PreOp/PreOpModule'));

import './App.css';

const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" />;
};

const DoctorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'DOCTOR') return <Navigate to="/" />;
  return children;
};

const PatientRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'PATIENT') return <Navigate to="/" />;
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'DOCTOR') return <Navigate to="/doctor-dashboard" />;
  if (user.role === 'PATIENT') return <Navigate to="/patient-dashboard" />;
  return <Navigate to="/login" />;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  return (
    <div className="app-container" style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      <main className="main-content" style={{ padding: 0, margin: 0, width: '100%' }}>
        <div className="page-container" style={{ maxWidth: '100%' }}>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Root redirect */}
              <Route path="/" element={<PrivateRoute><DashboardRedirect /></PrivateRoute>} />

              {/* Patient routes */}
              <Route path="/patient-dashboard" element={<PatientRoute><PatientDashboard /></PatientRoute>} />
              <Route path="/patient-dashboard/questionnaire" element={<PatientRoute><PatientQuestionnaire /></PatientRoute>} />
              <Route path="/patient-dashboard/airway" element={<PatientRoute><AirwayEvaluation /></PatientRoute>} />

              {/* Doctor routes */}
              <Route path="/doctor-dashboard" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
              <Route path="/doctor-dashboard/preop" element={<DoctorRoute><PreOpModule /></DoctorRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
