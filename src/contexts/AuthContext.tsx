"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { users } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('projectzen-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('projectzen-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((email: string, role: UserRole) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('projectzen-user', JSON.stringify(foundUser));
      router.push('/');
    } else {
      // In a real app, you'd show an error.
      // For this demo, we'll find the first user with the selected role.
      const userByRole = users.find(u => u.role === role);
      if (userByRole) {
        setUser(userByRole);
        localStorage.setItem('projectzen-user', JSON.stringify(userByRole));
        router.push('/');
      } else {
        alert('No user found for this role.');
      }
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('projectzen-user');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
