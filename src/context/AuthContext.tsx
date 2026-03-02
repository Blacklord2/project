import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, ApiUser } from '@/lib/api';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (email: string, fullName: string, password: string) => Promise<User | null>;
}

/* ─── Context ────────────────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(api: ApiUser): User {
  return { id: String(api.id), email: api.email, fullName: api.fullName };
}

/* ─── Provider ───────────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Restore session from stored JWT on mount
  useEffect(() => {
    const token = localStorage.getItem('db_token');
    if (!token) { setLoading(false); return; }

    authApi.me()
      .then(apiUser => setUser(toUser(apiUser)))
      .catch(() => localStorage.removeItem('db_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const { user: apiUser, token } = await authApi.login(email, password);
      localStorage.setItem('db_token', token);
      const u = toUser(apiUser);
      setUser(u);
      return u;
    } catch {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('db_token');
    setUser(null);
  };

  const register = async (email: string, fullName: string, password: string): Promise<User | null> => {
    try {
      const { user: apiUser, token } = await authApi.register(email, fullName, password);
      localStorage.setItem('db_token', token);
      const u = toUser(apiUser);
      setUser(u);
      return u;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
