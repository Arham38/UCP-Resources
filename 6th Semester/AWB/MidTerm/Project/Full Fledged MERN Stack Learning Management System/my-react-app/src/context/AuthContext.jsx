import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Read initial user from localStorage synchronously — avoids setState-in-effect
const getStoredUser = () => {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) return JSON.parse(userData);
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      const { data } = await authService.login({ email, password });
      const { token, user: userData } = data;
      if (token && userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      const { data } = await authService.register({ name, email, password, role });
      const { token, user: userData } = data;
      if (token && userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Expose a way to refresh the stored user after profile update
  const refreshUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
