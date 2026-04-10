import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { notificationAPI } from '../api/notification.api';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
  action?: {
    label: string;
    url: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  subscribeToPush: () => Promise<void>;
  unsubscribeFromPush: () => Promise<void>;
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// VAPID public key - should be set in environment variables
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      checkNotificationPermission();
      registerServiceWorker();
    }
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      socket.on('notification', handleIncomingNotification);
      socket.on('notification:read', handleNotificationRead);
      socket.on('notification:deleted', handleNotificationDeleted);

      return () => {
        socket.off('notification');
        socket.off('notification:read');
        socket.off('notification:deleted');
      };
    }
  }, [socket, user]);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        setSwRegistration(registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  const subscribeToPush = async () => {
    if (!swRegistration || permission !== 'granted') return;

    try {
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
      });

      await notificationAPI.subscribeToPush(subscription);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!swRegistration) return;

    try {
      const subscription = await swRegistration.pushManager.getSubscription();
      if (subscription) {
        await notificationAPI.unsubscribeFromPush();
        await subscription.unsubscribe();
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncomingNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast for real-time notification
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                notification.type === 'success' ? 'bg-green-100' :
                notification.type === 'error' ? 'bg-red-100' :
                notification.type === 'warning' ? 'bg-yellow-100' :
                'bg-blue-100'
              }`}>
                <div className={`w-5 h-5 ${
                  notification.type === 'success' ? 'text-green-600' :
                  notification.type === 'error' ? 'text-red-600' :
                  notification.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {notification.type === 'success' && '✓'}
                  {notification.type === 'error' && '✗'}
                  {notification.type === 'warning' && '⚠'}
                  {notification.type === 'info' && 'ℹ'}
                </div>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ), { duration: 5000 });

    // Show browser notification if permitted
    if (permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
        badge: '/badge.png',
        tag: notification.id,
        data: notification.data
      });
    }
  };

  const handleNotificationRead = ({ id }: { id: string }) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotificationDeleted = ({ id }: { id: string }) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(prevCount => prevCount - 1);
      }
      return prev.filter(n => n.id !== id);
    });
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationAPI.deleteNotification(id);
      setNotifications(prev => {
        const notification = prev.find(n => n.id === id);
        if (notification && !notification.read) {
          setUnreadCount(prevCount => prevCount - 1);
        }
        return prev.filter(n => n.id !== id);
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      await notificationAPI.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    subscribeToPush,
    unsubscribeFromPush,
    permission,
    requestPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};