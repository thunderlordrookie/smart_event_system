import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, api } from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    loadNotifications();
  }, []);

  // Mock notifications since we don't have a real notifications API
  const loadNotifications = async () => {
    try {
      // In a real app, this would fetch from notifications API
      const mockNotifications = [
        {
          id: 1,
          title: 'Event Reminder',
          message: 'Your event "Tech Workshop" is starting in 2 hours',
          type: 'reminder',
          is_read: false,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          event_id: 1
        },
        {
          id: 2,
          title: 'New Registration',
          message: 'John Doe registered for your event "Community Cleanup"',
          type: 'registration',
          is_read: true,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          event_id: 2
        },
        {
          id: 3,
          title: 'Event Update',
          message: 'The location for "Charity Run" has been updated',
          type: 'event_update',
          is_read: false,
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          event_id: 3
        },
        {
          id: 4,
          title: 'Feedback Received',
          message: 'You received new feedback for "Web Development Bootcamp"',
          type: 'feedback',
          is_read: true,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          event_id: 4
        }
      ];

      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, is_read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'registration': return '👤';
      case 'event_update': return '🔄';
      case 'feedback': return '💬';
      default: return '🔔';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading notifications...</div>
      </div>
    );
  }

  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1>Notifications</h1>
          <p style={{ color: '#666', margin: 0 }}>
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Mark All as Read
          </button>
        )}
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

      {notifications.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
          <h3>No Notifications</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            You're all caught up! Notifications will appear here for event updates, reminders, and registrations.
          </p>
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
            Browse Events
          </Link>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd',
          overflow: 'hidden'
        }}>
          {notifications.map((notification, index) => (
            <div 
              key={notification.id}
              style={{
                padding: '1.5rem',
                borderBottom: index < notifications.length - 1 ? '1px solid #eee' : 'none',
                backgroundColor: notification.is_read ? 'white' : '#f8f9fa',
                position: 'relative'
              }}
            >
              {!notification.is_read && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#007bff',
                  borderRadius: '50%'
                }} />
              )}
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  fontSize: '1.5rem',
                  width: '40px',
                  textAlign: 'center'
                }}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: notification.is_read ? 'normal' : 'bold',
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem'
                  }}>
                    {notification.title}
                  </div>
                  <div style={{ color: '#666', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {notification.message}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>
                    {getTimeAgo(notification.created_at)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {notification.event_id && (
                <div style={{ marginTop: '1rem' }}>
                  <Link 
                    to={`/events/${notification.event_id}`}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#007bff',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      display: 'inline-block'
                    }}
                  >
                    View Event
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Notification Settings */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginTop: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Notification Settings</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>Event Reminders</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Get reminders before your events</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input type="checkbox" defaultChecked style={{ display: 'none' }} />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#28a745',
                borderRadius: '24px',
                transition: '0.4s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '16px',
                  width: '16px',
                  left: '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.4s'
                }} />
              </span>
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>Registration Notifications</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Get notified when someone registers for your events</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input type="checkbox" defaultChecked style={{ display: 'none' }} />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#28a745',
                borderRadius: '24px',
                transition: '0.4s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '16px',
                  width: '16px',
                  left: '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.4s'
                }} />
              </span>
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>Event Updates</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Get notified about event changes</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input type="checkbox" defaultChecked style={{ display: 'none' }} />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#28a745',
                borderRadius: '24px',
                transition: '0.4s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '16px',
                  width: '16px',
                  left: '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.4s'
                }} />
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}