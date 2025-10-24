import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReduxProvider } from './providers/ReduxProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectForm from './components/projects/ProjectForm';
import './App.scss';

function App() {
  return (
    <ReduxProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Project routes */}
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/new" 
                element={
                  <ProtectedRoute>
                    <ProjectForm mode="create" />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:projectNumber" 
                element={
                  <ProtectedRoute>
                    <ProjectDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:projectNumber/edit" 
                element={
                  <ProtectedRoute>
                    <ProjectForm mode="edit" />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ReduxProvider>
  );
}

export default App