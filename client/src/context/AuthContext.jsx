import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper to configure token in axios headers
const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear errors helper
  const clearError = () => setError(null);

  // Check login status on mount using localStorage token
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      setAuthHeader(token);

      try {
        const { data } = await axios.get(`${API}/api/auth/me`);
        setUser(data);
      } catch (err) {
        localStorage.removeItem('token');
        setAuthHeader(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  // Register action
  const register = async (name, email, password, role = 'student') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });
      
      const { token, user: userData } = data;
      localStorage.setItem('token', token);
      setAuthHeader(token);
      setUser(userData);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Login action
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
      
      const { token, user: userData } = data;
      localStorage.setItem('token', token);
      setAuthHeader(token);
      setUser(userData);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Logout action
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setAuthHeader(null);
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    clearError,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
