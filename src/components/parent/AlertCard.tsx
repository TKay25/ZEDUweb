// src/components/parent/AlertCard.tsx
import React, { useState } from 'react';
import {
  AlertCircle, CheckCircle, Info, XCircle,
  X, Bell, Calendar, Clock, User,
  BookOpen, GraduationCap, CreditCard,
  TrendingUp
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export type AlertType = 'info' | 'success' | 'warning' | 'error';
export type AlertPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  category?: 'academic' | 'attendance' | 'payment' | 'event' | 'achievement' | 'general';
  metadata?: {
    studentName?: string;
    studentId?: string;
    subject?: string;
    amount?: number;
    dueDate?: Date;
    grade?: string;
  };
}

interface AlertCardProps {
  alert: Alert;
  onDismiss?: (alertId: string) => void;
  onMarkAsRead?: (alertId: string) => void;
  onAction?: (alertId: string) => void;
  compact?: boolean;
  className?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onDismiss,
  onMarkAsRead,
  onAction,
  compact = false,
  className = ''
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRead, setIsRead] = useState(alert.read);

  const getTypeIcon = () => {
    switch (alert.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (alert.priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryIcon = () => {
    switch (alert.category) {
      case 'academic':
        return <BookOpen className="w-4 h-4" />;
      case 'attendance':
        return <Clock className="w-4 h-4" />;
      case 'payment':
        return <CreditCard className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'achievement':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = () => {
    setIsRead(true);
    onMarkAsRead?.(alert.id);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.(alert.id);
  };

  const handleAction = () => {
    onAction?.(alert.id);
    alert.onAction?.();
  };

  if (isDismissed) return null;

  if (compact) {
    return (
      <div
        className={`
          relative bg-white dark:bg-gray-800 rounded-lg shadow-sm
          border-l-4 ${isRead ? 'border-gray-300' : 'border-blue-500'}
          hover:shadow-md transition-all duration-200
          ${className}
        `}
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {getTypeIcon()}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`text-sm font-semibold ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                    {alert.title}
                  </h4>
                  <Badge className={getPriorityColor()}>
                    {alert.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{alert.message}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(alert.timestamp)}
                  </span>
                  {alert.metadata?.studentName && (
                    <span className="text-xs text-gray-400 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {alert.metadata.studentName}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 ml-3">
              {!isRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Mark as read"
                >
                  <CheckCircle className="w-4 h-4 text-gray-400 hover:text-green-500" />
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300
        ${!isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}
        hover:shadow-lg
        ${className}
      `}
    >
      {/* Priority indicator bar */}
      <div className={`absolute top-0 left-0 w-1 h-full ${
        alert.priority === 'urgent' ? 'bg-red-500' :
        alert.priority === 'high' ? 'bg-orange-500' :
        alert.priority === 'medium' ? 'bg-yellow-500' :
        'bg-blue-500'
      }`} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${alert.type === 'success' ? 'bg-green-100' :
                  alert.type === 'warning' ? 'bg-yellow-100' :
                  alert.type === 'error' ? 'bg-red-100' :
                  'bg-blue-100'}
              `}>
                {getTypeIcon()}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h3 className={`text-lg font-semibold ${!isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                  {alert.title}
                </h3>
                <Badge className={getPriorityColor()}>
                  {alert.priority.toUpperCase()}
                </Badge>
                {alert.category && (
                  <Badge variant="secondary" className="flex items-center">
                    {getCategoryIcon()}
                    <span className="ml-1 capitalize">{alert.category}</span>
                  </Badge>
                )}
                {!isRead && (
                  <Badge variant="primary" className="animate-pulse">
                    New
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                {alert.message}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(alert.timestamp)}
                </span>

                {alert.metadata?.studentName && (
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Student: {alert.metadata.studentName}
                  </span>
                )}

                {alert.metadata?.subject && (
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Subject: {alert.metadata.subject}
                  </span>
                )}

                {alert.metadata?.grade && (
                  <span className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Grade: {alert.metadata.grade}
                  </span>
                )}

                {alert.metadata?.amount !== undefined && (
                  <span className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Amount: ${alert.metadata.amount}
                  </span>
                )}

                {alert.metadata?.dueDate && (
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due: {new Date(alert.metadata.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {alert.actionable && (alert.actionLabel || onAction) && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAction}
                  >
                    {alert.actionLabel || 'Take Action'}
                  </Button>
                )}
                {!isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAsRead}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Additional component: AlertList for grouping multiple alerts
interface AlertListProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
  onMarkAsRead?: (alertId: string) => void;
  onAction?: (alertId: string) => void;
  title?: string;
  emptyMessage?: string;
  className?: string;
}

export const AlertList: React.FC<AlertListProps> = ({
  alerts,
  onDismiss,
  onMarkAsRead,
  onAction,
  title = 'Notifications',
  emptyMessage = 'No alerts to display',
  className = ''
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'read') return alert.read;
    if (categoryFilter !== 'all') return alert.category === categoryFilter;
    return true;
  });

  // Fix: Safely get unique categories with type guard
  const categories = ['all', ...new Set(
    alerts
      .map(a => a.category)
      .filter((cat): cat is NonNullable<typeof cat> => cat !== undefined && cat !== null)
  )];

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <Card className={className}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold">{title}</h2>
            {unreadCount > 0 && (
              <Badge variant="primary" className="animate-pulse">
                {unreadCount} unread
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter buttons */}
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 text-sm transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1 text-sm transition-colors ${
                  filter === 'read'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Read
              </button>
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={onDismiss}
              onMarkAsRead={onMarkAsRead}
              onAction={onAction}
            />
          ))
        ) : (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{emptyMessage}</p>
            {unreadCount > 0 && filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Show all alerts
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AlertCard;