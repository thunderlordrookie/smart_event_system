import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

// QR Code Generator Component
const QRCodeGenerator = ({ eventId, onClose }) => {
  const [qrCode, setQrCode] = useState('');
  
  useEffect(() => {
    // Generate a simple QR code data (in real app, use a QR library)
    const qrData = `SMART-EVENTS-ATTENDANCE:${eventId}-${Date.now()}`;
    setQrCode(qrData);
  }, [eventId]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h3>Attendance QR Code</h3>
        <div style={{
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '1rem 0',
          fontFamily: 'monospace',
          wordBreak: 'break-all'
        }}>
          {qrCode}
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          Participants can scan this code to mark attendance
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function AttendanceManagement() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEventData();
  }, [id]);

  const loadEventData = async () => {
    try {
      const [eventData, attendanceData, registrationData] = await Promise.all([
        fetchAPI(`${api.events}?event_id=${id}`),
        fetchAPI(`${api.attendance}?event_id=${id}`),
        fetchAPI(`${api.eventRegistrations}?event_id=${id}`)
      ]);

      setEvent(eventData[0]);
      setAttendees(attendanceData);
      setRegistrations(registrationData);
    } catch (err) {
      setError('Failed to load event data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (userId, userName) => {
    setMarkingAttendance(true);
    setError('');
    
    try {
      const result = await fetchAPI(api.attendance, {
        method: 'POST',
        body: JSON.stringify({
          event_id: id,
          user_id: userId,
          status: 'present'
        })
      });

      if (result.success) {
        setSuccess(`Attendance marked for ${userName}`);
        loadEventData(); // Refresh data
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to mark attendance');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setMarkingAttendance(false);
    }
  };

  const getAttendanceStatus = (userId) => {
    const attendee = attendees.find(a => a.user_id == userId);
    return attendee ? 'Present' : 'Absent';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading attendance data...</div>
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

  const presentCount = attendees.length;
  const registeredCount = registrations.length;
  const attendanceRate = registeredCount > 0 ? ((presentCount / registeredCount) * 100).toFixed(1) : 0;

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
        <h1>Attendance Management</h1>
        <p style={{ color: '#666', margin: 0 }}>Manage attendance for: <strong>{event.title}</strong></p>
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

      {/* Attendance Stats */}
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
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            {presentCount}
          </div>
          <div style={{ color: '#666' }}>Present</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
            {registeredCount - presentCount}
          </div>
          <div style={{ color: '#666' }}>Absent</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
            {attendanceRate}%
          </div>
          <div style={{ color: '#666' }}>Attendance Rate</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6c757d' }}>
            {registeredCount}
          </div>
          <div style={{ color: '#666' }}>Total Registered</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowQRCode(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          📱 Generate QR Code
        </button>
        <button
          onClick={loadEventData}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh Data
        </button>
        <Link 
          to={`/events/${id}/feedback/view`}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6f42c1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          📊 View Feedback
        </Link>
      </div>

      {/* Attendance List */}
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
          Registered Participants ({registrations.length})
        </div>
        
        {registrations.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            No participants registered for this event yet.
          </div>
        ) : (
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {registrations.map(registration => (
              <div 
                key={registration.registration_id}
                style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{registration.full_name}</div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>{registration.email}</div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#6c757d',
                    marginTop: '0.25rem'
                  }}>
                    Registered: {new Date(registration.registration_date).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: getAttendanceStatus(registration.user_id) === 'Present' ? '#d4edda' : '#f8d7da',
                    color: getAttendanceStatus(registration.user_id) === 'Present' ? '#155724' : '#721c24'
                  }}>
                    {getAttendanceStatus(registration.user_id)}
                  </span>
                  
                  {getAttendanceStatus(registration.user_id) === 'Absent' && (
                    <button
                      onClick={() => handleMarkAttendance(registration.user_id, registration.full_name)}
                      disabled={markingAttendance}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: markingAttendance ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: markingAttendance ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {markingAttendance ? 'Marking...' : 'Mark Present'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Export Attendance Data</h4>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => alert('CSV export functionality would be implemented here')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📄 Export to CSV
          </button>
          <button
            onClick={() => alert('PDF export functionality would be implemented here')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📊 Export to PDF
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🖨️ Print Report
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeGenerator 
          eventId={id} 
          onClose={() => setShowQRCode(false)} 
        />
      )}
    </div>
  );
}