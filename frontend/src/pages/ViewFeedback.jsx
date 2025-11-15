import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

export default function ViewFeedback() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEventFeedback();
  }, [id]);

  const loadEventFeedback = async () => {
    try {
      const [eventData, feedbackData] = await Promise.all([
        fetchAPI(`${api.events}?event_id=${id}`),
        fetchAPI(`${api.feedback}?event_id=${id}`)
      ]);

      setEvent(eventData[0]);
      setFeedback(feedbackData);
    } catch (err) {
      setError('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = () => {
    if (feedback.length === 0) return 0;
    const sum = feedback.reduce((total, item) => total + item.rating, 0);
    return (sum / feedback.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedback.forEach(item => {
      distribution[item.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading feedback data...</div>
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

  const averageRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div>
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
        <h1>Event Feedback</h1>
        <p style={{ color: '#666', margin: 0 }}>
          Participant feedback for: <strong>{event.title}</strong>
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Feedback Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
            {averageRating}/5
          </div>
          <div style={{ color: '#666' }}>Average Rating</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
            {feedback.length}
          </div>
          <div style={{ color: '#666' }}>Total Responses</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            {((feedback.filter(f => f.rating >= 4).length / feedback.length) * 100 || 0).toFixed(0)}%
          </div>
          <div style={{ color: '#666' }}>Satisfaction Rate</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6c757d' }}>
            {event.capacity}
          </div>
          <div style={{ color: '#666' }}>Total Participants</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Rating Distribution</h3>
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ width: '60px', fontWeight: 'bold' }}>
              {rating} ★
            </div>
            <div style={{ flex: 1, margin: '0 1rem' }}>
              <div style={{
                height: '20px',
                backgroundColor: '#e9ecef',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: rating >= 4 ? '#28a745' : rating >= 3 ? '#ffc107' : '#dc3545',
                  width: `${(ratingDistribution[rating] / feedback.length) * 100}%`,
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
            <div style={{ width: '40px', textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>
              {ratingDistribution[rating]}
            </div>
          </div>
        ))}
      </div>

      {/* Individual Feedback */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #ddd',
          fontWeight: 'bold'
        }}>
          Participant Feedback ({feedback.length})
        </div>
        
        {feedback.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
            <h3>No Feedback Yet</h3>
            <p>No participants have submitted feedback for this event.</p>
            <Link 
              to={`/events/${id}/attendance`}
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
              View Attendance
            </Link>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {feedback.map((item, index) => (
              <div 
                key={item.feedback_id}
                style={{
                  padding: '1.5rem',
                  borderBottom: index < feedback.length - 1 ? '1px solid #eee' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.full_name}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                      {new Date(item.submitted_at).toLocaleDateString()} at {new Date(item.submitted_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: '#f8f9fa',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px'
                  }}>
                    <span style={{ color: '#ffc107' }}>★</span>
                    <span style={{ fontWeight: 'bold' }}>{item.rating}/5</span>
                  </div>
                </div>
                
                {item.comment && (
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '4px',
                    borderLeft: '4px solid #007bff'
                  }}>
                    <p style={{ margin: 0, lineHeight: '1.5' }}>{item.comment}</p>
                  </div>
                )}
                
                {!item.comment && (
                  <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
                    No additional comments provided.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🖨️ Print Report
        </button>
        <button
          onClick={() => alert('Export functionality would be implemented here')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📊 Export Data
        </button>
        <Link 
          to={`/events/${id}/attendance`}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          👥 View Attendance
        </Link>
      </div>
    </div>
  );
}