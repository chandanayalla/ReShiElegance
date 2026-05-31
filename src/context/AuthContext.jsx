import React, { createContext, useCallback, useEffect, useState } from 'react';
import { supabase, supabaseRedirectUrl } from '../services/supabase';

export const AuthContext = createContext();

const mapSupabaseUser = (supabaseUser) => {
  if (!supabaseUser) {
    return null;
  }

  const profileName = supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: profileName || supabaseUser.email?.split('@')[0] || 'User',
    createdAt: supabaseUser.created_at,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setUser(mapSupabaseUser(data.session?.user));
        setLoading(false);
      }
    };

    syncSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user));
      setLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }

    const nextUser = mapSupabaseUser(data.user);
    setUser(nextUser);
    return nextUser;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: supabaseRedirectUrl,
      },
    });

    if (error) {
      if (error.message?.toLowerCase().includes('unsupported provider')) {
        throw new Error('Google login is not enabled in Supabase. Enable Google in Supabase Auth Providers or keep VITE_ENABLE_GOOGLE_AUTH=false.');
      }
      throw error;
    }
  }, []);

  const register = useCallback(async (email, password, name) => {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw error;
    }

    const nextUser = mapSupabaseUser(data.user);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) {
      throw error;
    }

    const nextUser = mapSupabaseUser(data.user);
    setUser(nextUser);
    return nextUser;
  }, []);

  const isAdmin = Boolean(user?.email?.toLowerCase().includes('admin'));

  const value = {
    user,
    isAdmin,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
