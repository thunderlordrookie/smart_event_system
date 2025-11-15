const API_BASE = 'http://localhost/smart_event_system/backend/api';

export const api = {
  // Auth
  users: `${API_BASE}/users.php`,
  
  // Events
  events: `${API_BASE}/events.php`,
  eventRegistrations: `${API_BASE}/event_registrations.php`,
  attendance: `${API_BASE}/attendance.php`,
  feedback: `${API_BASE}/feedback.php`,
};

// Generic fetch helper
export const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return await response.json();
  } catch (error) {
    throw new Error('Network error');
  }
};