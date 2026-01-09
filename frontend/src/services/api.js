// Backend API base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const api = {
  users: `${API_BASE}/users`,
  events: `${API_BASE}/events`,
  eventRegistrations: `${API_BASE}/registrations`,
  attendance: `${API_BASE}/attendance`,
  feedback: `${API_BASE}/feedback`,
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