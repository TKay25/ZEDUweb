// src/api/settings.api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const settingsAPI = {
  getSettings: () => {
    return axios.get(`${API_URL}/settings`);
  },

  updateSettings: (settings: any) => {
    return axios.put(`${API_URL}/settings`, settings);
  },

  resetSettings: () => {
    return axios.post(`${API_URL}/settings/reset`);
  },

  exportData: () => {
    return axios.post(`${API_URL}/settings/export`);
  },

  deleteAccount: () => {
    return axios.delete(`${API_URL}/user/account`);
  },
};