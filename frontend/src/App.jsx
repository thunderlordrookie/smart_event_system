import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import Layout from './components/Layout';

// Protected route component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
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
          
          {/* Protected Routes - Only accessible when logged in */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Dashboard</h1>
                    <p>Dashboard page - Coming soon in Phase 2!</p>
                    <p>This will show user statistics, recent activities, and quick actions.</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-events" 
            element={
              <ProtectedRoute>
                <Layout>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>My Events</h1>
                    <p>My Events page - Coming soon in Phase 2!</p>
                    <p>Organizers will see events they created, participants will see events they registered for.</p>
                  </div>
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
                    <h1>Profile</h1>
                    <p>Profile page - Coming soon in Phase 2!</p>
                    <p>Users will be able to view and edit their profile information.</p>
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