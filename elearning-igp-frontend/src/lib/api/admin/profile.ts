// src/lib/api/admin/profile.ts

import axiosInstance from '../axios'; 

export const adminProfileApi = {
  getProfile: async () => {
    const response = await axiosInstance.get('/admin/profile');
    return response.data;
  },

  updateProfile: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }) => {
    const response = await axiosInstance.put('/admin/profile', data);
    return response.data;
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.post('/admin/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updatePassword: async (data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    const response = await axiosInstance.put('/admin/profile/password', data);
    return response.data;
  },

  toggle2FA: async () => {
    const response = await axiosInstance.post('/admin/profile/2fa/toggle');
    return response.data;
  }
};