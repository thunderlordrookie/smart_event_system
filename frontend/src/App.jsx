import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import EventRegistration from './pages/EventRegistration';
import MyRegistrations from './pages/MyRegistrations';
import AttendanceManagement from './pages/AttendanceManagement';
import SubmitFeedback from './pages/SubmitFeedback';
import ViewFeedback from './pages/ViewFeedback';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';

// Protected route component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// Organizer-only route component
function OrganizerRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === 'organizer' ? children : <Navigate to="/events" />;
}

// Public route component (redirect to events if already logged in)
function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/events" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - Only accessible when logged out */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Public Routes - Accessible to all */}
          <Route 
            path="/events" 
            element={
              <Layout>
                <EventsList />
              </Layout>
            } 
          />
          <Route 
            path="/events/:id" 
            element={
              <Layout>
                <EventDetails />
              </Layout>
            } 
          />
          
          {/* Protected Routes - Organizers Only */}
          <Route 
            path="/events/create" 
            element={
              <OrganizerRoute>
                <Layout>
                  <CreateEvent />
                </Layout>
              </OrganizerRoute>
            } 
          />
          <Route 
            path="/events/:id/edit" 
            element={
              <OrganizerRoute>
                <Layout>
                  <EditEvent />
                </Layout>
              </OrganizerRoute>
            } 
          />
          <Route 
            path="/events/:id/attendance" 
            element={
              <OrganizerRoute>
                <Layout>
                  <AttendanceManagement />
                </Layout>
              </OrganizerRoute>
            } 
          />
          <Route 
            path="/events/:id/feedback/view" 
            element={
              <OrganizerRoute>
                <Layout>
                  <ViewFeedback />
                </Layout>
              </OrganizerRoute>
            } 
          />
          
          {/* Protected Routes - All Logged-in Users */}
          <Route 
            path="/my-events" 
            element={
              <ProtectedRoute>
                <Layout>
                  <MyEvents />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/:id/register" 
            element={
              <ProtectedRoute>
                <Layout>
                  <EventRegistration />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-registrations" 
            element={
              <ProtectedRoute>
                <Layout>
                  <MyRegistrations />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/:id/feedback" 
            element={
              <ProtectedRoute>
                <Layout>
                  <SubmitFeedback />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Notifications />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Profile Management</h1>
                    <p>Advanced profile features - Coming soon!</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/events" />} />
          
          {/* 404 Page */}
          <Route 
            path="*" 
            element={
              <Layout>
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem 2rem',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  margin: '2rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <h1 style={{ fontSize: '4rem', margin: '0', color: '#dc3545' }}>404</h1>
                  <h2>Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                  <a 
                    href="/events"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      marginTop: '1rem'
                    }}
                  >
                    Go to Events
                  </a>
                </div>
              </Layout>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;