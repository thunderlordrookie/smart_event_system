import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    try {
      let url;
      if (user.role === 'organizer') {
        // Organizer sees events they created
        url = `${api.events}?organizer_id=${user.user_id}`;
      } else {
        // Participant sees events they registered for
        url = `${api.eventRegistrations}?user_id=${user.user_id}`;
      }
      
      const data = await fetchAPI(url);
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const result = await fetchAPI(`${api.events}?event_id=${eventId}`, {
        method: 'DELETE'
      });

      if (result.success) {
        setEvents(events.filter(event => event.event_id !== eventId));
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
        <div>Loading your events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ color: 'red' }}>{error}</div>
        <button 
          onClick={loadMyEvents}
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>
          {user.role === 'organizer' ? 'My Created Events' : 'My Registered Events'}
        </h1>
        {user.role === 'organizer' && (
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
            Create New Event
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h3>No events found</h3>
          <p>
            {user.role === 'organizer' 
              ? "You haven't created any events yet." 
              : "You haven't registered for any events yet."}
          </p>
          {user.role === 'organizer' ? (
            <Link 
              to="/events/create"
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
              Create Your First Event
            </Link>
          ) : (
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
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {events.map(event => (
            <div 
              key={event.event_id || event.registration_id}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    <Link 
                      to={`/events/${event.event_id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {event.title}
                    </Link>
                  </h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#666' }}>{event.description}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <strong>Date & Time:</strong><br />
                      {new Date(event.event_date + ' ' + event.event_time).toLocaleString()}
                    </div>
                    <div>
                      <strong>Location:</strong><br />
                      {event.location}
                    </div>
                    <div>
                      <strong>Category:</strong><br />
                      {event.category}
                    </div>
                    {user.role === 'organizer' && (
                      <div>
                        <strong>Registrations:</strong><br />
                        {event.current_participants || 0} / {event.capacity}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link 
                    to={`/events/${event.event_id}`}
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
                    View Details
                  </Link>
                  
                  {user.role === 'organizer' && (
                    <>
                      <Link 
                        to={`/events/${event.event_id}/edit`}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#ffc107',
                          color: '#212529',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          textAlign: 'center',
                          fontSize: '0.9rem'
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event.event_id)}
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
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}