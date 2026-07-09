import React, { createContext, useEffect, useState } from 'react';
import api from '../services/api';

export const AdminAuthContext = createContext();

const readStoredAdmin = () => {
  try {
    const stored = localStorage.getItem('reshiAdmin');
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem('reshiAdmin');
    return null;
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(readStoredAdmin);
  const [token, setToken] = useState(() => localStorage.getItem('reshiAdminToken') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      localStorage.setItem('reshiAdmin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('reshiAdmin');
    }
  }, [admin]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('reshiAdminToken', token);
    } else {
      localStorage.removeItem('reshiAdminToken');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/login', { email, password });
      const { admin: adminData, token: authToken } = response.data;
      setAdmin(adminData);
      setToken(authToken);
      return response.data;
    } catch (error) {
      setAdmin(null);
      setToken('');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken('');
    localStorage.removeItem('reshiAdmin');
    localStorage.removeItem('reshiAdminToken');
  };

  const isAuthenticated = Boolean(token);

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
