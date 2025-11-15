import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchAPI(api.events);
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ color: 'red' }}>{error}</div>
        <button 
          onClick={loadEvents}
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
        <h1>Upcoming Events</h1>
        {user && user.role === 'organizer' && (
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
            Create Event
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
          <p>There are no upcoming events at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {events.map(event => (
            <div 
              key={event.event_id}
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
                      <strong>Organizer:</strong><br />
                      {event.organizer_name}
                    </div>
                    <div>
                      <strong>Available Spots:</strong><br />
                      {event.available_spots || event.capacity} / {event.capacity}
                    </div>
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
                  
                  {user && user.role === 'participant' && (
                    <Link 
                      to={`/events/${event.event_id}/register`}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                      }}
                    >
                      Register
                    </Link>
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