"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  // We can't use useData here directly because AuthProvider is not wrapped by DataProvider yet.
  // Instead, we will get the data context inside the functions where it's needed.
  // For initial load, we will fetch users from a mock source or wait.
  const [initialUsers, setInitialUsers] = useState<User[] | null>(null);

  useEffect(() => {
    // This is a workaround to get user data on initial load without creating context dependency cycle
    import('@/lib/data').then(data => {
        setInitialUsers(data.users);
    });
  }, []);

  useEffect(() => {
    if(initialUsers) {
        try {
          const storedUser = localStorage.getItem('projectzen-user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const latestUser = initialUsers.find(u => u.id === parsedUser.id);
            setUser(latestUser || null);
          }
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
          localStorage.removeItem('projectzen-user');
        } finally {
          setLoading(false);
        }
    }
  }, [initialUsers]);

  const login = useCallback((email: string, password?: string) => {
    const foundUser = initialUsers?.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
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
  }, [router, toast, initialUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('projectzen-user');
    localStorage.removeItem('projectzen-notifications'); // Clear notifications on logout
    router.push('/login');
  }, [router]);

  const signup = useCallback((name: string, email: string, password?: string) => {
    // Note: This relies on a hook that will be available when this function is actually called from the UI
    const { addUser, users } = useData();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "An account with this email already exists.",
        });
        return;
    }
    
    addUser({ name, email, password: password || '', role: 'Team Member' });
    toast({
        title: "Account Created",
        description: "Your account has been created successfully. Please log in.",
    });
    router.push('/login');
  }, [router, toast]);

  const value = useMemo(() => ({
      user,
      loading,
      login,
      logout,
      signup: (name: string, email: string, password?: string) => {
          // This is a bit of a hack to get around the context dependency issue.
          // When signup is called, DataProvider will be available.
          // A better solution would be to separate auth logic from data logic more cleanly.
          const data = useData();
          const existingUser = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (existingUser) {
              toast({
                  variant: "destructive",
                  title: "Signup Failed",
                  description: "An account with this email already exists.",
              });
              return;
          }
          
          data.addUser({ name, email, password: password || '', role: 'Team Member' });
          toast({
              title: "Account Created",
              description: "Your account has been created successfully. Please log in.",
          });
          router.push('/login');
      }
  }), [user, loading, login, logout, router, toast]);

  if (loading) {
     return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

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
