"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => void;
  logout: () => void;
  loading: boolean;
  signup: (name: string, email: string, password?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const data = useData();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('projectzen-user');
      if (storedUser) {
        // We need to find the user from the data context to ensure it's up-to-date
        const parsedUser = JSON.parse(storedUser);
        const latestUser = data.users.find(u => u.id === parsedUser.id);
        setUser(latestUser || null);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('projectzen-user');
    } finally {
      setLoading(false);
    }
  }, [data.users]);

  const login = useCallback((email: string, password?: string) => {
    const foundUser = data.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('projectzen-user', JSON.stringify(foundUser));
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      })
    }
  }, [router, toast, data.users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('projectzen-user');
    router.push('/login');
  }, [router]);

  const signup = useCallback((name: string, email: string, password?: string) => {
    const existingUser = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "An account with this email already exists.",
        });
        return;
    }
    
    const newUser = data.addUser({ name, email, password: password || '', role: 'Team Member' });
    toast({
        title: "Account Created",
        description: "Your account has been created successfully. Please log in.",
    });
    router.push('/login');
  }, [data, router, toast]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, signup }}>
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
