import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css'; // We'll create this CSS file

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* CodePen Navbar */}
      <nav>
        <div className="navbar">
          <div className="container nav-container">
            <input 
              className="checkbox" 
              type="checkbox" 
              checked={menuOpen}
              onChange={(e) => setMenuOpen(e.target.checked)}
            />
            <div className="hamburger-lines">
              <span className="line line1"></span>
              <span className="line line2"></span>
              <span className="line line3"></span>
            </div>  
            
            {/* Logo */}
            <div className="logo">
              <Link to="/" style={{ textDecoration: 'none', color: '#0e2431' }}>
                <h1>SmartEvents</h1>
              </Link>
            </div>

            {/* Menu Items */}
            <div className="menu-items">
              {user ? (
                // Logged-in User Menu
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      onClick={closeMenu}
                      style={{ 
                        color: isActiveRoute('/dashboard') ? '#2563eb' : '#0e2431',
                        fontWeight: isActiveRoute('/dashboard') ? '600' : '500'
                      }}
                    >
                      📊 Dashboard
                    </Link>
                  </li>
                  
                  <li>
                    <Link 
                      to="/events" 
                      onClick={closeMenu}
                      style={{ 
                        color: isActiveRoute('/events') ? '#2563eb' : '#0e2431',
                        fontWeight: isActiveRoute('/events') ? '600' : '500'
                      }}
                    >
                      📅 All Events
                    </Link>
                  </li>

                  {/* Organizer Specific */}
                  {user.role === 'organizer' && (
                    <>
                      <li>
                        <Link 
                          to="/events/create" 
                          onClick={closeMenu}
                          style={{ 
                            color: isActiveRoute('/events/create') ? '#2563eb' : '#0e2431',
                            fontWeight: isActiveRoute('/events/create') ? '600' : '500'
                          }}
                        >
                          ➕ Create Event
                        </Link>
                      </li>
                      
                      <li>
                        <Link 
                          to="/my-events" 
                          onClick={closeMenu}
                          style={{ 
                            color: isActiveRoute('/my-events') ? '#2563eb' : '#0e2431',
                            fontWeight: isActiveRoute('/my-events') ? '600' : '500'
                          }}
                        >
                          🎯 My Events
                        </Link>
                      </li>
                    </>
                  )}

                  {/* Participant Specific */}
                  {user.role === 'participant' && (
                    <li>
                      <Link 
                        to="/my-registrations" 
                        onClick={closeMenu}
                        style={{ 
                          color: isActiveRoute('/my-registrations') ? '#2563eb' : '#0e2431',
                          fontWeight: isActiveRoute('/my-registrations') ? '600' : '500'
                        }}
                      >
                        📋 My Registrations
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link 
                      to="/notifications" 
                      onClick={closeMenu}
                      style={{ 
                        color: isActiveRoute('/notifications') ? '#2563eb' : '#0e2431',
                        fontWeight: isActiveRoute('/notifications') ? '600' : '500'
                      }}
                    >
                      🔔 Notifications
                    </Link>
                  </li>

                  {/* User Info */}
                  <li style={{ 
                    marginTop: '2rem', 
                    paddingTop: '1rem', 
                    borderTop: '2px solid #e2e8f0' 
                  }}>
                    <div style={{ 
                      textAlign: 'center', 
                      marginBottom: '1rem',
                      color: '#64748b'
                    }}>
                      <div style={{ fontWeight: '600', color: '#0e2431' }}>
                        {user.full_name}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        textTransform: 'capitalize',
                        color: '#2563eb'
                      }}>
                        {user.role}
                      </div>
                    </div>
                  </li>

                  <li>
                    <Link 
                      to="/profile" 
                      onClick={closeMenu}
                      style={{ 
                        color: isActiveRoute('/profile') ? '#2563eb' : '#0e2431',
                        fontWeight: isActiveRoute('/profile') ? '600' : '500'
                      }}
                    >
                      👤 My Profile
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        fontSize: '1.2rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        padding: '0.7rem',
                        width: '100%',
                        textAlign: 'left',
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    >
                      🚪 Logout
                    </button>
                  </li>
                </>
              ) : (
                // Public Menu
                <>
                  <li>
                    <Link 
                      to="/events" 
                      onClick={closeMenu}
                      style={{ 
                        color: isActiveRoute('/events') ? '#2563eb' : '#0e2431',
                        fontWeight: isActiveRoute('/events') ? '600' : '500'
                      }}
                    >
                      📅 Browse Events
                    </Link>
                  </li>
                  
                  <li>
                    <Link 
                      to="/login" 
                      onClick={closeMenu}
                      style={{ 
                        color: isActiveRoute('/login') ? '#2563eb' : '#0e2431',
                        fontWeight: isActiveRoute('/login') ? '600' : '500'
                      }}
                    >
                      🔑 Login
                    </Link>
                  </li>
                  
                  <li>
                    <Link 
                      to="/register" 
                      onClick={closeMenu}
                      style={{ 
                        color: isActiveRoute('/register') ? '#2563eb' : '#0e2431',
                        fontWeight: isActiveRoute('/register') ? '600' : '500',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.7rem 1.5rem',
                        borderRadius: '0.5rem',
                        display: 'inline-block'
                      }}
                    >
                      ✨ Get Started
                    </Link>
                  </li>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ 
        padding: '2rem 0',
        minHeight: 'calc(100vh - 62px)'
      }}>
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '3rem 0 2rem',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
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
                <Link to="/dashboard" style={{ color: '#94a3b8' }}>Dashboard</Link>
                <Link to="/login" style={{ color: '#94a3b8' }}>Login</Link>
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