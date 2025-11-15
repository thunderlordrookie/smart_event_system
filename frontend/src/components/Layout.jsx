import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navLinkStyles = (isActive) => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    color: isActive ? '#2563eb' : '#64748b',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    border: isActive ? '1px solid #dbeafe' : '1px solid transparent'
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4rem'
          }}>
            {/* Logo */}
            <Link 
              to="/events" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1.5rem',
                color: '#1e293b'
              }}
            >
              <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: '#2563eb',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                S
              </div>
              Smart Events
            </Link>

            {/* Desktop Navigation */}
            <nav style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {user ? (
                <>
                  <Link 
                    to="/events" 
                    style={navLinkStyles(isActiveRoute('/events'))}
                  >
                    Events
                  </Link>
                  
                  {user.role === 'organizer' && (
                    <Link 
                      to="/events/create" 
                      style={navLinkStyles(isActiveRoute('/events/create'))}
                    >
                      Create Event
                    </Link>
                  )}
                  
                  <Link 
                    to={user.role === 'organizer' ? '/my-events' : '/my-registrations'} 
                    style={navLinkStyles(
                      isActiveRoute(user.role === 'organizer' ? '/my-events' : '/my-registrations')
                    )}
                  >
                    {user.role === 'organizer' ? 'My Events' : 'My Registrations'}
                  </Link>
                  
                  <Link 
                    to="/dashboard" 
                    style={navLinkStyles(isActiveRoute('/dashboard'))}
                  >
                    Dashboard
                  </Link>

                  {/* User Menu */}
                  <div style={{ 
                    position: 'relative',
                    marginLeft: '1rem',
                    paddingLeft: '1rem',
                    borderLeft: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          color: '#1e293b'
                        }}>
                          {user.full_name}
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem',
                          color: '#64748b',
                          textTransform: 'capitalize'
                        }}>
                          {user.role}
                        </div>
                      </div>
                      
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: '#2563eb',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>

                      <button
                        onClick={handleLogout}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'transparent',
                          color: '#64748b',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#fef2f2';
                          e.target.style.color = '#dc2626';
                          e.target.style.borderColor = '#fecaca';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#64748b';
                          e.target.style.borderColor = '#d1d5db';
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link 
                    to="/login" 
                    style={navLinkStyles(isActiveRoute('/login'))}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    style={{
                      ...navLinkStyles(isActiveRoute('/register')),
                      backgroundColor: '#2563eb',
                      color: 'white'
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        flex: 1,
        padding: '2rem 0'
      }}>
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '2rem 0',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Smart Events</h4>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                Professional event management system for communities and organizations.
              </p>
            </div>
            
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/events" style={{ color: '#94a3b8' }}>Browse Events</Link>
                <Link to="/login" style={{ color: '#94a3b8' }}>Login</Link>
                <Link to="/register" style={{ color: '#94a3b8' }}>Register</Link>
              </div>
            </div>
            
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Contact</h4>
              <div style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                <div>Email: support@smaratevents.com</div>
                <div>Phone: (555) 123-4567</div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            borderTop: '1px solid #334155',
            marginTop: '2rem',
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <p>&copy; 2024 Smart Events System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}