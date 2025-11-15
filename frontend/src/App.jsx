import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsList from './pages/EventsList';
import EventDetails from './pages/EventDetails';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Layout><EventsList /></Layout>} />
          <Route path="/events/:id" element={<Layout><EventDetails /></Layout>} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/events" />} />
          
          {/* Protected routes will be added in Phase 2 */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;