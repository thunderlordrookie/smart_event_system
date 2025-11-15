import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

export default function SubmitFeedback() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEventDetails();
    checkExistingFeedback();
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

  const checkExistingFeedback = async () => {
    try {
      const feedback = await fetchAPI(`${api.feedback}?event_id=${id}&user_id=${user.user_id}`);
      if (feedback.length > 0) {
        setHasSubmitted(true);
        setFormData({
          rating: feedback[0].rating,
          comment: feedback[0].comment
        });
      }
    } catch (err) {
      console.error('Error checking feedback:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating: rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await fetchAPI(api.feedback, {
        method: 'POST',
        body: JSON.stringify({
          event_id: id,
          user_id: user.user_id,
          rating: parseInt(formData.rating),
          comment: formData.comment
        })
      });

      if (result.success) {
        setSuccess(hasSubmitted ? 'Feedback updated successfully!' : 'Feedback submitted successfully!');
        setHasSubmitted(true);
        setTimeout(() => {
          navigate('/my-registrations');
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading event details...</div>
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

  const isPastEvent = new Date(event.event_date + ' ' + event.event_time) > new Date();

  if (!isPastEvent) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ 
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Event Not Completed</h3>
          <p style={{ margin: 0 }}>You can only submit feedback for events that have already taken place.</p>
        </div>
        <Link 
          to={`/events/${id}`}
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
          Back to Event
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
        <h1>{hasSubmitted ? 'Update Your Feedback' : 'Submit Feedback'}</h1>
        <p style={{ color: '#666', margin: 0 }}>
          Share your experience for: <strong>{event.title}</strong>
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
      
      {success && (
        <div style={{
          backgroundColor: '#d1edff',
          color: '#0c5460',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {success}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Event Summary */}
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Event Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <div><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</div>
            <div><strong>Time:</strong> {event.event_time}</div>
            <div><strong>Location:</strong> {event.location}</div>
            <div><strong>Organizer:</strong> {event.organizer_name}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
              How would you rate this event?
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  style={{
                    fontSize: '2rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: star <= formData.rating ? '#ffc107' : '#e4e5e9',
                    transition: 'color 0.2s'
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              {formData.rating === 1 && 'Poor'}
              {formData.rating === 2 && 'Fair'}
              {formData.rating === 3 && 'Good'}
              {formData.rating === 4 && 'Very Good'}
              {formData.rating === 5 && 'Excellent'}
            </div>
          </div>

          {/* Comment */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Your Comments {!hasSubmitted && '(Optional)'}
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="6"
              placeholder="Share your thoughts about the event... What did you like? Any suggestions for improvement?"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
              {formData.comment.length}/500 characters
            </div>
          </div>

          {/* Submission Info */}
          <div style={{ 
            backgroundColor: '#e7f3ff',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              <div><strong>Submitted by:</strong> {user.full_name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              {hasSubmitted && (
                <div><strong>Status:</strong> Previously Submitted</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
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
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: submitting ? '#6c757d' : (hasSubmitted ? '#ffc107' : '#28a745'),
                color: hasSubmitted ? '#212529' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {submitting ? 'Submitting...' : (hasSubmitted ? 'Update Feedback' : 'Submit Feedback')}
            </button>
          </div>
        </form>
      </div>

      {/* Feedback Guidelines */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginTop: '2rem',
        border: '1px solid #ddd'
      }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Feedback Guidelines</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666' }}>
          <li>Be constructive and specific in your comments</li>
          <li>Focus on the event content, organization, and venue</li>
          <li>Your feedback helps organizers improve future events</li>
          <li>All feedback is anonymous to other participants</li>
        </ul>
      </div>
    </div>
  );
}