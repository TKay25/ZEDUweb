// src/api/profile.api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const profileAPI = {
  uploadAvatar: (formData: FormData) => {
    return axios.post(`${API_URL}/profile/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadCover: (formData: FormData) => {
    return axios.post(`${API_URL}/profile/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};