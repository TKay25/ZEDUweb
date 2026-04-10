// src/api/messaging.api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const messagingAPI = {
  getConversations: () => {
    return axios.get(`${API_URL}/conversations`);
  },

  getMessages: (conversationId: string) => {
    return axios.get(`${API_URL}/conversations/${conversationId}/messages`);
  },

  markConversationAsRead: (conversationId: string) => {
    return axios.post(`${API_URL}/conversations/${conversationId}/read`);
  },

  sendMessage: (formData: FormData) => {
    return axios.post(`${API_URL}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  addReaction: (messageId: string, emoji: string) => {
    return axios.post(`${API_URL}/messages/${messageId}/reactions`, { emoji });
  },

  deleteMessage: (messageId: string) => {
    return axios.delete(`${API_URL}/messages/${messageId}`);
  },
};