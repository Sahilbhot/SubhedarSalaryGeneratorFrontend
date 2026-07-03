/* eslint-disable react-refresh/only-export-components -- provider + useAuth hook co-located by design */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getToken, setToken } from '@/shared/services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore the session from a stored token (if any).
  useEffect(() => {
    let active = true;
    async function restore() {
      if (!getToken()) {
        if (active) setLoading(false);
        return;
      }
      try {
        const res = await api.me();
        if (active) setUser(res.data);
      } catch {
        setToken(null); // token invalid/expired → clear it
      } finally {
        if (active) setLoading(false);
      }
    }
    restore();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    hasRole: (...roles) => Boolean(user) && roles.includes(user.role),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
