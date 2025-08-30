"use client";

import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
      <AuthProvider>
        <NotificationProvider>
            <DataProvider>
                {children}
            </DataProvider>
        </NotificationProvider>
      </AuthProvider>
  );
}
