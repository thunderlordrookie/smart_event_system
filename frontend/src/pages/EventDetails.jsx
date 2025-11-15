import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await fetchAPI(`${api.events}?event_id=${id}`);
      setEvent(data[0]); // Get first event from array
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`${api.events}?event_id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        navigate('/events');
      } else {
        setError('Failed to delete event');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ color: 'red' }}>{error || 'Event not found'}</div>
        <Link 
          to="/events"
          style={{ 
            marginTop: '1rem',
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

  const isOrganizer = user && user.user_id === event.organizer_id;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/events"
          style={{ 
            color: '#007bff',
            textDecoration: 'none',
            marginBottom: '1rem',
            display: 'inline-block'
          }}
        >
          ← Back to Events
        </Link>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ margin: '0 0 1rem 0', color: '#333' }}>{event.title}</h1>
            <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>{event.description}</p>
          </div>
          
          {isOrganizer && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link 
                to={`/events/${event.event_id}/edit`}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ffc107',
                  color: '#212529',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Event Details</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
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
                <strong>Category:</strong> {event.category}
              </div>
              <div>
                <strong>Capacity:</strong> {event.capacity} participants
              </div>
              <div>
                <strong>Available Spots:</strong> {event.available_spots || event.capacity}
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Organizer</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <strong>Name:</strong> {event.organizer_name}
              </div>
              <div>
                <strong>Contact:</strong> {user?.email || 'Login to view contact'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {user ? (
            <>
              {user.role === 'participant' && (
                <Link 
                  to={`/events/${event.event_id}/register`}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}
                >
                  Register for Event
                </Link>
              )}
              
              {isOrganizer && (
                <>
                  <Link 
                    to={`/events/${event.event_id}/attendance`}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    Manage Attendance
                  </Link>
                  <Link 
                    to={`/events/${event.event_id}/feedback/view`}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#6f42c1',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    View Feedback
                  </Link>
                </>
              )}
            </>
          ) : (
            <Link 
              to="/login"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              Login to Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}