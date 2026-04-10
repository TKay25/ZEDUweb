// src/components/layout/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Define User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Define Notification interface
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NavbarProps {
  user: User | null;
  onMobileMenuToggle: () => void;
  onSidebarToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onMobileMenuToggle, onSidebarToggle }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'New Assignment',
      message: 'You have a new assignment in Mathematics',
      timestamp: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'success',
      title: 'Quiz Graded',
      message: 'Your quiz has been graded: 95%',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Deadline Approaching',
      message: 'Assignment due in 2 hours',
      timestamp: '2 hours ago',
      read: true,
    },
  ]);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 bg-white/95 backdrop-blur-md shadow-sm z-30 transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={onSidebarToggle}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search bar */}
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses, assignments..."
                  className="w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100"
                aria-label="Notifications"
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-500"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`
                            p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer
                            transition-colors duration-200
                            ${!notification.read ? 'bg-blue-50' : ''}
                          `}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-xl">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <span className="text-4xl mb-2 block">📭</span>
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-200 text-center">
                    <Link
                      to="/notifications"
                      className="text-sm text-blue-600 hover:text-blue-500"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 focus:outline-none"
                aria-label="Profile menu"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    showProfileMenu ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs opacity-80">{user?.email || 'user@example.com'}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;