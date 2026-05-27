import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('isAdmin');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const login = useCallback((email, password) => {
    // Mock authentication
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Check if admin
    if (email.includes('admin')) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
    }
    
    return userData;
  }, []);

  const register = useCallback((email, password, name) => {
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
