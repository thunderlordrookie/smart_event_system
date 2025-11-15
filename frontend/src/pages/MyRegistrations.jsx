import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadMyRegistrations();
  }, []);

  const loadMyRegistrations = async () => {
    try {
      const data = await fetchAPI(`${api.eventRegistrations}?user_id=${user.user_id}`);
      setRegistrations(data);
    } catch (err) {
      setError('Failed to load your registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
      return;
    }

    try {
      const result = await fetchAPI(`${api.eventRegistrations}?registration_id=${registrationId}`, {
        method: 'DELETE'
      });

      if (result.success) {
        setRegistrations(registrations.filter(reg => reg.registration_id !== registrationId));
      } else {
        setError('Failed to cancel registration');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const getEventStatus = (eventDate, eventTime) => {
    const eventDateTime = new Date(eventDate + ' ' + eventTime);
    const now = new Date();
    
    if (eventDateTime < now) {
      return { status: 'completed', text: 'Event Completed', color: '#6c757d' };
    } else if (eventDateTime < new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
      return { status: 'upcoming', text: 'Upcoming (Today)', color: '#dc3545' };
    } else {
      return { status: 'future', text: 'Upcoming', color: '#28a745' };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading your registrations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ color: 'red' }}>{error}</div>
        <button 
          onClick={loadMyRegistrations}
          style={{ 
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>My Event Registrations</h1>
        <p style={{ color: '#666', margin: 0 }}>
          View and manage all events you've registered for.
        </p>
      </div>

      {registrations.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h3>No Registrations Found</h3>
          <p>You haven't registered for any events yet.</p>
          <Link 
            to="/events"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-block',
              marginTop: '1rem'
            }}
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {registrations.map(registration => {
            const status = getEventStatus(registration.event_date, registration.event_time);
            const isPastEvent = status.status === 'completed';
            
            return (
              <div 
                key={registration.registration_id}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
              >
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: status.color,
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {status.text}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      <Link 
                        to={`/events/${registration.event_id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {registration.title}
                      </Link>
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <strong>Date & Time:</strong><br />
                        {new Date(registration.event_date + ' ' + registration.event_time).toLocaleString()}
                      </div>
                      <div>
                        <strong>Location:</strong><br />
                        {registration.location}
                      </div>
                      <div>
                        <strong>Registered On:</strong><br />
                        {new Date(registration.registration_date).toLocaleDateString()}
                      </div>
                    </div>

                    {isPastEvent && (
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginTop: '1rem'
                      }}>
                        <strong>Event Completed</strong>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                          This event has already taken place. Thank you for participating!
                        </p>
                        <Link 
                          to={`/events/${registration.event_id}/feedback`}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#6f42c1',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginTop: '0.5rem',
                            fontSize: '0.9rem'
                          }}
                        >
                          Submit Feedback
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link 
                      to={`/events/${registration.event_id}`}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                      }}
                    >
                      View Event
                    </Link>
                    
                    {!isPastEvent && (
                      <button
                        onClick={() => handleCancelRegistration(registration.registration_id, registration.title)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Cancel Registration
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats */}
      {registrations.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #ddd',
          marginTop: '2rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Registration Summary</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                {registrations.length}
              </div>
              <div style={{ color: '#666' }}>Total Registrations</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {registrations.filter(reg => getEventStatus(reg.event_date, reg.event_time).status !== 'completed').length}
              </div>
              <div style={{ color: '#666' }}>Upcoming Events</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6c757d' }}>
                {registrations.filter(reg => getEventStatus(reg.event_date, reg.event_time).status === 'completed').length}
              </div>
              <div style={{ color: '#666' }}>Completed Events</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}