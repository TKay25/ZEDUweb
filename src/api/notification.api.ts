import api from './axios.config';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'assignment' | 'grade' | 'attendance' | 'payment' | 'message';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  archived: boolean;
  actionUrl?: string;
  actionText?: string;
  sender?: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  expiresAt?: string;
}

export interface NotificationPreferences {
  email: {
    assignments: boolean;
    grades: boolean;
    attendance: boolean;
    payments: boolean;
    messages: boolean;
    announcements: boolean;
    marketing: boolean;
  };
  push: {
    assignments: boolean;
    grades: boolean;
    attendance: boolean;
    payments: boolean;
    messages: boolean;
    announcements: boolean;
  };
  sms: {
    assignments: boolean;
    grades: boolean;
    attendance: boolean;
    payments: boolean;
    urgent: boolean;
  };
  inApp: {
    assignments: boolean;
    grades: boolean;
    attendance: boolean;
    payments: boolean;
    messages: boolean;
    announcements: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // Format: "HH:mm"
    end: string; // Format: "HH:mm"
    timezone: string;
  };
  digest: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'never';
    time: string; // Format: "HH:mm"
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface NotificationBatch {
  ids: string[];
  action: 'read' | 'unread' | 'archive' | 'delete';
}

export interface NotificationFilter {
  types?: string[];
  priorities?: string[];
  read?: boolean;
  archived?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'priority' | 'type';
  sortOrder?: 'asc' | 'desc';
}

export const notificationAPI = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async (filters?: NotificationFilter) => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.types?.length) params.append('types', filters.types.join(','));
      if (filters.priorities?.length) params.append('priorities', filters.priorities.join(','));
      if (filters.read !== undefined) params.append('read', String(filters.read));
      if (filters.archived !== undefined) params.append('archived', String(filters.archived));
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.offset) params.append('offset', String(filters.offset));
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }
    
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  /**
   * Get a single notification by ID
   */
  getNotificationById: async (id: string) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark multiple notifications as read
   */
  markMultipleAsRead: async (ids: string[]) => {
    const response = await api.patch('/notifications/read-multiple', { ids });
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  /**
   * Archive a notification
   */
  archiveNotification: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/archive`);
    return response.data;
  },

  /**
   * Archive multiple notifications
   */
  archiveMultiple: async (ids: string[]) => {
    const response = await api.patch('/notifications/archive-multiple', { ids });
    return response.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Delete multiple notifications
   */
  deleteMultiple: async (ids: string[]) => {
    const response = await api.delete('/notifications/delete-multiple', { data: { ids } });
    return response.data;
  },

  /**
   * Clear all notifications (archive all)
   */
  clearAll: async () => {
    const response = await api.post('/notifications/clear-all');
    return response.data;
  },

  /**
   * Get notification statistics
   */
  getStats: async () => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  /**
   * Get unread count
   */
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },

  /**
   * Get notification preferences
   */
  getPreferences: async () => {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (preferences: Partial<NotificationPreferences>) => {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data;
  },

  /**
   * Send a notification to a specific user
   */
  sendToUser: async (userId: string, notification: Partial<Notification>) => {
    const response = await api.post(`/notifications/send/user/${userId}`, notification);
    return response.data;
  },

  /**
   * Send a notification to multiple users
   */
  sendToUsers: async (userIds: string[], notification: Partial<Notification>) => {
    const response = await api.post('/notifications/send/users', { userIds, notification });
    return response.data;
  },

  /**
   * Send a notification to a role
   */
  sendToRole: async (role: string, notification: Partial<Notification>) => {
    const response = await api.post(`/notifications/send/role/${role}`, notification);
    return response.data;
  },

  /**
   * Send a notification to all users
   */
  sendToAll: async (notification: Partial<Notification>) => {
    const response = await api.post('/notifications/send/all', notification);
    return response.data;
  },

  /**
   * Create a system announcement
   */
  createAnnouncement: async (announcement: {
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    expiresAt?: string;
    targetRoles?: string[];
  }) => {
    const response = await api.post('/notifications/announcements', announcement);
    return response.data;
  },

  /**
   * Get notifications by type
   */
  getByType: async (type: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));
    
    const response = await api.get(`/notifications/type/${type}`, { params });
    return response.data;
  },

  /**
   * Get notifications by priority
   */
  getByPriority: async (priority: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));
    
    const response = await api.get(`/notifications/priority/${priority}`, { params });
    return response.data;
  },

  /**
   * Search notifications
   */
  search: async (query: string, filters?: Omit<NotificationFilter, 'search'>) => {
    const params = new URLSearchParams({ search: query });
    
    if (filters) {
      if (filters.types?.length) params.append('types', filters.types.join(','));
      if (filters.priorities?.length) params.append('priorities', filters.priorities.join(','));
      if (filters.read !== undefined) params.append('read', String(filters.read));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.offset) params.append('offset', String(filters.offset));
    }
    
    const response = await api.get('/notifications/search', { params });
    return response.data;
  },

  /**
   * Get recent notifications (for header dropdown)
   */
  getRecent: async (limit: number = 10) => {
    const response = await api.get('/notifications/recent', { params: { limit } });
    return response.data;
  },

  /**
   * Batch operation on notifications
   */
  batchOperation: async (batch: NotificationBatch) => {
    const response = await api.post('/notifications/batch', batch);
    return response.data;
  },

  /**
   * Subscribe to push notifications
   */
  subscribeToPush: async (subscription: PushSubscription) => {
    const response = await api.post('/notifications/push/subscribe', subscription);
    return response.data;
  },

  /**
   * Unsubscribe from push notifications
   */
  unsubscribeFromPush: async () => {
    const response = await api.post('/notifications/push/unsubscribe');
    return response.data;
  },

  /**
   * Get push notification subscription status
   */
  getPushSubscriptionStatus: async () => {
    const response = await api.get('/notifications/push/status');
    return response.data;
  },

  /**
   * Schedule a notification for later
   */
  scheduleNotification: async (
    userId: string,
    notification: Partial<Notification>,
    scheduledFor: string
  ) => {
    const response = await api.post('/notifications/schedule', {
      userId,
      notification,
      scheduledFor
    });
    return response.data;
  },

  /**
   * Cancel a scheduled notification
   */
  cancelScheduled: async (notificationId: string) => {
    const response = await api.delete(`/notifications/schedule/${notificationId}`);
    return response.data;
  },

  /**
   * Get scheduled notifications
   */
  getScheduled: async () => {
    const response = await api.get('/notifications/scheduled');
    return response.data;
  },

  /**
   * Dismiss a notification (mark as read and archive)
   */
  dismiss: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/dismiss`);
    return response.data;
  },

  /**
   * Mute notifications for a period
   */
  mute: async (duration: number, unit: 'minutes' | 'hours' | 'days') => {
    const response = await api.post('/notifications/mute', { duration, unit });
    return response.data;
  },

  /**
   * Unmute notifications
   */
  unmute: async () => {
    const response = await api.post('/notifications/unmute');
    return response.data;
  },

  /**
   * Get mute status
   */
  getMuteStatus: async () => {
    const response = await api.get('/notifications/mute-status');
    return response.data;
  },

  /**
   * Export notifications
   */
  exportNotifications: async (format: 'json' | 'csv' | 'pdf', filters?: NotificationFilter) => {
    const response = await api.post('/notifications/export', { format, filters }, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Get notification templates
   */
  getTemplates: async () => {
    const response = await api.get('/notifications/templates');
    return response.data;
  },

  /**
   * Create a notification template (admin only)
   */
  createTemplate: async (template: {
    name: string;
    title: string;
    message: string;
    type: string;
    defaultPriority: string;
  }) => {
    const response = await api.post('/notifications/templates', template);
    return response.data;
  },

  /**
   * Update a notification template (admin only)
   */
  updateTemplate: async (id: string, template: Partial<{
    title: string;
    message: string;
    type: string;
    defaultPriority: string;
  }>) => {
    const response = await api.put(`/notifications/templates/${id}`, template);
    return response.data;
  },

  /**
   * Delete a notification template (admin only)
   */
  deleteTemplate: async (id: string) => {
    const response = await api.delete(`/notifications/templates/${id}`);
    return response.data;
  },

  /**
   * Test notification (for development)
   */
  testNotification: async (type: string) => {
    const response = await api.post('/notifications/test', { type });
    return response.data;
  }
};

// WebSocket events for real-time notifications
export const notificationEvents = {
  NEW_NOTIFICATION: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATIONS_READ: 'notifications:read',
  NOTIFICATION_ARCHIVED: 'notification:archived',
  NOTIFICATION_DELETED: 'notification:deleted',
  UNREAD_COUNT_UPDATED: 'notifications:unread-count',
  PREFERENCES_UPDATED: 'notifications:preferences-updated',
  MUTE_STATUS_CHANGED: 'notifications:mute-changed'
};

// Helper functions
export const notificationHelpers = {
  /**
   * Get icon name based on notification type
   */
  getIconForType: (type: string): string => {
    const icons: Record<string, string> = {
      info: 'info-circle',
      success: 'check-circle',
      warning: 'exclamation-triangle',
      error: 'x-circle',
      assignment: 'clipboard-list',
      grade: 'star',
      attendance: 'calendar-check',
      payment: 'credit-card',
      message: 'envelope'
    };
    return icons[type] || 'bell';
  },

  /**
   * Get color class based on priority
   */
  getColorForPriority: (priority: string): string => {
    const colors: Record<string, string> = {
      low: 'text-blue-500',
      medium: 'text-yellow-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    };
    return colors[priority] || 'text-gray-500';
  },

  /**
   * Get background color class based on priority
   */
  getBgColorForPriority: (priority: string): string => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100',
      medium: 'bg-yellow-100',
      high: 'bg-orange-100',
      urgent: 'bg-red-100'
    };
    return colors[priority] || 'bg-gray-100';
  },

  /**
   * Format notification time
   */
  formatTime: (date: string): string => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return notificationDate.toLocaleDateString();
    }
  },

  /**
   * Group notifications by date
   */
  groupByDate: (notifications: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    
    return groups;
  },

  /**
   * Filter notifications by type
   */
  filterByType: (notifications: Notification[], types: string[]) => {
    return notifications.filter(n => types.includes(n.type));
  },

  /**
   * Filter notifications by priority
   */
  filterByPriority: (notifications: Notification[], priorities: string[]) => {
    return notifications.filter(n => priorities.includes(n.priority));
  },

  /**
   * Get unread notifications
   */
  getUnread: (notifications: Notification[]) => {
    return notifications.filter(n => !n.read);
  },

  /**
   * Get archived notifications
   */
  getArchived: (notifications: Notification[]) => {
    return notifications.filter(n => n.archived);
  },

  /**
   * Sort notifications by date (newest first)
   */
  sortByDate: (notifications: Notification[]) => {
    return [...notifications].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Sort notifications by priority
   */
  sortByPriority: (notifications: Notification[]) => {
    const priorityWeight: Record<string, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1
    };
    
    return [...notifications].sort((a, b) => 
      (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
    );
  }
};

export default notificationAPI;