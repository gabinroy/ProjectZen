
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Notification } from '@/lib/types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>, silent?: boolean) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load notifications from localStorage on component mount
    if (user) {
        try {
            const storedNotifications = localStorage.getItem(`projectzen-notifications-${user.id}`);
            if (storedNotifications) {
                setNotifications(JSON.parse(storedNotifications));
            } else {
                 setNotifications([]);
            }
        } catch (error) {
            console.error("Failed to parse notifications from localStorage", error);
            setNotifications([]);
        }
    } else {
        setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    // Save notifications to localStorage whenever they change
    if (user) {
        localStorage.setItem(`projectzen-notifications-${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>, silent = false) => {
    
    setNotifications(prev => {
        // Prevent duplicate notifications for silent notifications (e.g. due date reminders)
        if (silent) {
            const isDuplicate = prev.some(n => n.message === notificationData.message && n.userId === notificationData.userId);
            if (isDuplicate) return prev;
        }

        const newNotification: Notification = {
            ...notificationData,
            id: `notif-${Date.now()}-${Math.random()}`,
            createdAt: new Date().toISOString(),
            read: false,
        };
        return [newNotification, ...prev];
    });
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
