// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { authService, tokenService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = tokenService.get();
    const savedUser = localStorage.getItem('bb_user');
    if (token && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {}
    }
    return null;
  });
  const [isLoading] = useState(false);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    const userData = result.user as User;
    setUser(userData);
    localStorage.setItem('bb_user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    const result = await authService.register(name, email, password);
    const userData = result.user as User;
    setUser(userData);
    localStorage.setItem('bb_user', JSON.stringify(userData));
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('bb_user');
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading, login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
