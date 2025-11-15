// Use proxy path
const API_BASE = '/api/api';

export const api = {
  users: `${API_BASE}/users.php`,
  events: `${API_BASE}/events.php`,
  eventRegistrations: `${API_BASE}/event_registrations.php`,
  attendance: `${API_BASE}/attendance.php`,
  feedback: `${API_BASE}/feedback.php`,
};

export const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Network error: ' + error.message);
  }
};