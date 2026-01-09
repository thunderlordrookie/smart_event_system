import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchAPI, api } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await fetchAPI(api.users, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await fetchAPI(api.users, {
        method: 'POST',
        body: JSON.stringify({
          action: 'register',
          ...userData
        }),
      });
      return data;
    } catch (error) {
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}