import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import { AppointmentProvider } from './context/AppointmentContext';
import { AuthProvider } from './context/AuthContext';
import { PatientProvider } from './context/PatientContext';
import { PatientTaskProvider } from './context/PatientTaskContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <PatientProvider>
          <PatientTaskProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="calendar"
                    element={
                      <ProtectedRoute>
                        <Calendar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="patients"
                    element={
                      <ProtectedRoute>
                        <PatientList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="patients/:id"
                    element={
                      <ProtectedRoute>
                        <PatientDetail />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </PatientTaskProvider>
        </PatientProvider>
      </AppointmentProvider>
    </AuthProvider>
  );
}

export default App;
