import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

export default function EventRegistration() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEventDetails();
    checkRegistration();
  }, [id]);

  const loadEventDetails = async () => {
    try {
      const events = await fetchAPI(`${api.events}?event_id=${id}`);
      setEvent(events[0]);
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const registrations = await fetchAPI(`${api.eventRegistrations}?user_id=${user.user_id}`);
      const isRegistered = registrations.some(reg => reg.event_id == id);
      setAlreadyRegistered(isRegistered);
    } catch (err) {
      console.error('Error checking registration:', err);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    setError('');
    setSuccess('');

    try {
      const result = await fetchAPI(api.eventRegistrations, {
        method: 'POST',
        body: JSON.stringify({
          event_id: id,
          user_id: user.user_id
        })
      });

      if (result.success) {
        setSuccess('Successfully registered for the event!');
        setAlreadyRegistered(true);
        setTimeout(() => {
          navigate('/my-registrations');
        }, 2000);
      } else {
        setError(result.error || 'Failed to register for event');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading event details...</div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        <Link 
          to="/events"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ color: 'red', marginBottom: '1rem' }}>Event not found</div>
        <Link 
          to="/events"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const isEventFull = event.current_participants >= event.capacity;
  const isPastEvent = new Date(event.event_date + ' ' + event.event_time) < new Date();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to={`/events/${id}`}
          style={{ 
            color: '#007bff',
            textDecoration: 'none',
            marginBottom: '1rem',
            display: 'inline-block'
          }}
        >
          ← Back to Event Details
        </Link>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Register for Event
        </h1>

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
        
        {success && (
          <div style={{
            backgroundColor: '#d1edff',
            color: '#0c5460',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '2rem'
          }}>
            {success}
          </div>
        )}

        {/* Event Summary */}
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>{event.title}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}
            </div>
            <div>
              <strong>Time:</strong> {event.event_time}
            </div>
            <div>
              <strong>Location:</strong> {event.location}
            </div>
            <div>
              <strong>Available Spots:</strong> {event.capacity - event.current_participants} / {event.capacity}
            </div>
          </div>
          <p style={{ margin: '1rem 0 0 0', color: '#666' }}>{event.description}</p>
        </div>

        {/* Registration Status */}
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          {alreadyRegistered ? (
            <div>
              <div style={{ 
                backgroundColor: '#d1edff',
                color: '#0c5460',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>✓ Already Registered</h3>
                <p style={{ margin: 0 }}>You are already registered for this event.</p>
              </div>
              <Link 
                to="/my-registrations"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginRight: '1rem'
                }}
              >
                View My Registrations
              </Link>
              <Link 
                to="/events"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                Browse More Events
              </Link>
            </div>
          ) : isEventFull ? (
            <div>
              <div style={{ 
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Event Full</h3>
                <p style={{ margin: 0 }}>This event has reached its maximum capacity.</p>
              </div>
              <Link 
                to="/events"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                Browse Other Events
              </Link>
            </div>
          ) : isPastEvent ? (
            <div>
              <div style={{ 
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Event Ended</h3>
                <p style={{ margin: 0 }}>This event has already taken place.</p>
              </div>
              <Link 
                to="/events"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                Browse Current Events
              </Link>
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Confirm Registration</h3>
              <p style={{ marginBottom: '2rem', color: '#666' }}>
                You are about to register for <strong>{event.title}</strong>. 
                Please confirm your registration below.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: registering ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: registering ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {registering ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Information */}
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Registration Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Name:</strong> {user.full_name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Role:</strong> {user.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}