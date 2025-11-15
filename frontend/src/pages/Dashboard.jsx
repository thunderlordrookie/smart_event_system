import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [eventsData, registrationsData, attendanceData, feedbackData] = await Promise.all([
        fetchAPI(api.events),
        fetchAPI(api.eventRegistrations),
        fetchAPI(api.attendance),
        fetchAPI(api.feedback)
      ]);

      // Filter data based on user role
      const userEvents = user.role === 'organizer' 
        ? eventsData.filter(event => event.organizer_id === user.user_id)
        : eventsData;

      const userRegistrations = registrationsData.filter(reg => reg.user_id === user.user_id);
      const userAttendance = attendanceData.filter(att => att.user_id === user.user_id);
      const userFeedback = feedbackData.filter(fb => fb.user_id === user.user_id);

      // Calculate statistics
      const calculatedStats = {
        totalEvents: userEvents.length,
        totalRegistrations: userRegistrations.length,
        attendanceRate: userRegistrations.length > 0 
          ? ((userAttendance.length / userRegistrations.length) * 100).toFixed(1) 
          : 0,
        averageRating: userFeedback.length > 0
          ? (userFeedback.reduce((sum, fb) => sum + fb.rating, 0) / userFeedback.length).toFixed(1)
          : 0,
        upcomingEvents: userEvents.filter(event => 
          new Date(event.event_date + ' ' + event.event_time) > new Date()
        ).length,
        completedEvents: userEvents.filter(event => 
          new Date(event.event_date + ' ' + event.event_time) <= new Date()
        ).length
      };

      setStats(calculatedStats);
      setRecentEvents(userEvents.slice(0, 5));
      setRecentRegistrations(userRegistrations.slice(0, 5));
      
      // Upcoming events for participants
      const allUpcoming = eventsData
        .filter(event => new Date(event.event_date + ' ' + event.event_time) > new Date())
        .slice(0, 5);
      setUpcomingEvents(allUpcoming);

    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (eventDate, eventTime) => {
    const eventDateTime = new Date(eventDate + ' ' + eventTime);
    const now = new Date();
    
    if (eventDateTime < now) {
      return { status: 'completed', color: '#6c757d' };
    } else if (eventDateTime < new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
      return { status: 'today', color: '#dc3545' };
    } else {
      return { status: 'upcoming', color: '#28a745' };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <p style={{ color: '#666', margin: 0 }}>
          Welcome back, <strong>{user.full_name}</strong>! Here's your event overview.
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '2rem'
        }}>
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#007bff', marginBottom: '0.5rem' }}>
            {stats.totalEvents}
          </div>
          <div style={{ color: '#666', fontWeight: 'bold' }}>
            {user.role === 'organizer' ? 'Events Created' : 'Events Attended'}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#28a745', marginBottom: '0.5rem' }}>
            {stats.totalRegistrations}
          </div>
          <div style={{ color: '#666', fontWeight: 'bold' }}>Total Registrations</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffc107', marginBottom: '0.5rem' }}>
            {stats.attendanceRate}%
          </div>
          <div style={{ color: '#666', fontWeight: 'bold' }}>Attendance Rate</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6f42c1', marginBottom: '0.5rem' }}>
            {stats.averageRating}/5
          </div>
          <div style={{ color: '#666', fontWeight: 'bold' }}>Avg Rating</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Recent Events Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>
              {user.role === 'organizer' ? 'My Recent Events' : 'Recent Events'}
            </h3>
            <Link 
              to={user.role === 'organizer' ? '/my-events' : '/events'}
              style={{
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              View All →
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No events found.</p>
              {user.role === 'organizer' && (
                <Link 
                  to="/events/create"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginTop: '0.5rem'
                  }}
                >
                  Create Your First Event
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {recentEvents.map(event => {
                const status = getEventStatus(event.event_date, event.event_time);
                return (
                  <div 
                    key={event.event_id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        <Link 
                          to={`/events/${event.event_id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {event.title}
                        </Link>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {new Date(event.event_date).toLocaleDateString()} • {event.location}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: status.color,
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      {status.status === 'completed' ? 'Completed' : status.status === 'today' ? 'Today' : 'Upcoming'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Events / Recent Registrations */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>
              {user.role === 'organizer' ? 'Recent Registrations' : 'Upcoming Events'}
            </h3>
            <Link 
              to={user.role === 'organizer' ? '/events' : '/my-registrations'}
              style={{
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              View All →
            </Link>
          </div>

          {user.role === 'organizer' ? (
            recentRegistrations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>No recent registrations.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {recentRegistrations.map(registration => (
                  <div 
                    key={registration.registration_id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #eee',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {registration.full_name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                      Registered for: {registration.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#999' }}>
                      {new Date(registration.registration_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            upcomingEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>No upcoming events.</p>
                <Link 
                  to="/events"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginTop: '0.5rem'
                  }}
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {upcomingEvents.map(event => (
                  <div 
                    key={event.event_id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #eee',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      <Link 
                        to={`/events/${event.event_id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {event.title}
                      </Link>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                      {new Date(event.event_date).toLocaleDateString()} • {event.event_time}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#999' }}>
                      {event.location}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginTop: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {user.role === 'organizer' ? (
            <>
              <Link 
                to="/events/create"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                📝 Create New Event
              </Link>
              <Link 
                to="/my-events"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                👁️ View My Events
              </Link>
              <Link 
                to="/events"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                📊 Manage Events
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/events"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                🔍 Browse Events
              </Link>
              <Link 
                to="/my-registrations"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                📋 My Registrations
              </Link>
              <Link 
                to="/profile"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                👤 My Profile
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}