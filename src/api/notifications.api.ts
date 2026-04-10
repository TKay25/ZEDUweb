// src/api/notifications.api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const notificationsAPI = {
  getNotifications: () => {
    return axios.get(`${API_URL}/notifications`);
  },

  getNotificationStats: () => {
    return axios.get(`${API_URL}/notifications/stats`);
  },

  markNotificationAsRead: (notificationId: string) => {
    return axios.patch(`${API_URL}/notifications/${notificationId}/read`);
  },

  markAllNotificationsAsRead: () => {
    return axios.patch(`${API_URL}/notifications/read-all`);
  },

  archiveNotification: (notificationId: string) => {
    return axios.patch(`${API_URL}/notifications/${notificationId}/archive`);
  },

  deleteNotification: (notificationId: string) => {
    return axios.delete(`${API_URL}/notifications/${notificationId}`);
  },
};