import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data?.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('tripsync_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data?.success) {
      if (res.data.token) {
        localStorage.setItem('tripsync_token', res.data.token);
      }
      setUser(res.data.data);
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    if (res.data?.success) {
      if (res.data.token) {
        localStorage.setItem('tripsync_token', res.data.token);
      }
      setUser(res.data.data);
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Continue cleanup
    }
    localStorage.removeItem('tripsync_token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.data?.success) {
      setUser(res.data.data);
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Update failed');
  };

  const reloadUser = async () => {
    await fetchCurrentUser();
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    isPro: user?.isPro || user?.role === 'PRO_TRAVELER',
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateProfile,
    reloadUser
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
