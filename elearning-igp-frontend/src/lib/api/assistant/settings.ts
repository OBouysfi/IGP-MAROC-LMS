import apiClient from '../client';

export interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employee_id: string;
  department: string;
  role: string;
  bio?: string;
  linkedin?: string;
  avatar?: string;
}

export interface NotificationSettings {
  email_new_justification: boolean;
  email_high_absence: boolean;
  email_daily_report: boolean;
  push_new_justification: boolean;
  push_urgent_alerts: boolean;
}

export const assistantSettingsApi = {
  getProfile: async () => {
    const response = await apiClient.get('/assistant/settings/profile');
    return response;
  },

  updateProfile: async (data: Partial<ProfileData>) => {
    const response = await apiClient.put('/assistant/settings/profile', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/assistant/settings/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  changePassword: async (data: { current_password: string; new_password: string; new_password_confirmation: string }) => {
    const response = await apiClient.post('/assistant/settings/password', data);
    return response.data;
  },

  getNotifications: async () => {
    const response = await apiClient.get('/assistant/settings/notifications');
    return response;
  },

  updateNotifications: async (settings: NotificationSettings) => {
    const response = await apiClient.put('/assistant/settings/notifications', settings);
    return response.data;
  },
};