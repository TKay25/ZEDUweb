// src/pages/common/Notifications.tsx
import React, { useState, useEffect } from 'react';
import {
  Bell, CheckCircle, AlertCircle, Info,
  XCircle, Clock, Award,
  CheckCheck, Trash2, Archive,
  ChevronRight, Download
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
//import { Tabs } from '../../components/ui/Tabs';
import { notificationsAPI } from '../../api/notifications.api';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  archived: boolean;
  actionable: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    sender?: {
      id: string;
      name: string;
      avatar?: string;
    };
    entityId?: string;
    entityType?: string;
    priority?: 'high' | 'medium' | 'low';
    expiresAt?: Date;
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  archived: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

export const Notifications: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const [notificationsRes, statsRes] = await Promise.all([
        notificationsAPI.getNotifications(),
        notificationsAPI.getNotificationStats()
      ]);
      setNotifications(notificationsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsAPI.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      if (stats) {
        setStats({
          ...stats,
          unread: stats.unread - 1
        });
      }
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      
      if (stats) {
        setStats({
          ...stats,
          unread: 0
        });
      }
      
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleArchive = async (notificationId: string) => {
    try {
      await notificationsAPI.archiveNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (stats) {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
          setStats({
            ...stats,
            total: stats.total - 1,
            unread: notification.read ? stats.unread : stats.unread - 1,
            archived: stats.archived + 1
          });
        }
      }
      
      toast.success('Notification archived');
    } catch (error) {
      toast.error('Failed to archive notification');
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!window.confirm('Delete this notification?')) return;
    
    try {
      await notificationsAPI.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (stats) {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
          setStats({
            ...stats,
            total: stats.total - 1,
            unread: notification.read ? stats.unread : stats.unread - 1
          });
        }
      }
      
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-purple-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read && !notification.archived;
    if (activeTab === 'archived') return notification.archived;
    if (activeTab === 'all') return !notification.archived;
    
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || notification.metadata?.priority === selectedPriority;
    
    return matchesType && matchesPriority;
  });

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {stats.unread > 0 && (
            <Badge className="bg-primary-600 text-white animate-pulse">
              {stats.unread} new
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={stats.unread === 0}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Bell className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Bell className="w-8 h-8 text-primary-500" />
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Unread</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.unread}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Archived</p>
              <p className="text-2xl font-bold text-blue-700">{stats.archived}</p>
            </div>
            <Archive className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">By Type</p>
              <div className="text-sm font-medium text-green-700">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <Badge key={type} className="mr-1 mb-1 bg-green-100 text-green-800">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-40">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="achievement">Achievement</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>

          <div className="w-40">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex-1" />

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All ({stats.total - stats.archived})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'unread'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unread ({stats.unread})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'archived'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Archived ({stats.archived})
          </button>
        </nav>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              className={`p-4 hover:shadow-md transition-shadow ${
                !notification.read && !notification.archived
                  ? 'border-l-4 border-l-primary-500 bg-primary-50/30'
                  : ''
              }`}
            >
              <div className="flex items-start">
                {/* Icon */}
                <div className="flex-shrink-0 mr-4">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold">{notification.title}</h3>
                      {notification.metadata?.priority && (
                        <Badge className={`ml-2 ${getPriorityColor(notification.metadata.priority)}`}>
                          {notification.metadata.priority}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-gray-700">{notification.message}</p>

                  {notification.metadata?.sender && (
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Bell className="w-4 h-4 mr-1" />
                      {notification.metadata.sender.name}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-4">
                    {!notification.read && !notification.archived && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Mark as read
                      </Button>
                    )}
                    
                    {notification.actionable && notification.actionUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = notification.actionUrl!}
                      >
                        {notification.actionLabel || 'View Details'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                    
                    {!notification.archived && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchive(notification.id)}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No Notifications</h3>
            <p className="text-gray-500">
              {activeTab === 'unread'
                ? "You don't have any unread notifications"
                : activeTab === 'archived'
                ? "No archived notifications"
                : "You're all caught up!"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};