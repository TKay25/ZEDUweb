import api from './axios.config';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
  avatar?: File;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'avatar' && value instanceof File) {
          formData.append('avatar', value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.put('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData) => {
    const response = await api.post('/user/change-password', data);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  // Get all users (admin only)
  getUsers: async (params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/user', { params });
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (userId: string, role: string) => {
    const response = await api.patch(`/user/${userId}/role`, { role });
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete avatar
  deleteAvatar: async () => {
    const response = await api.delete('/user/avatar');
    return response.data;
  },

  // Get user activity log
  getActivityLog: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/user/activity', { params });
    return response.data;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences: any) => {
    const response = await api.put('/user/notification-preferences', preferences);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  }
};

export default userAPI;