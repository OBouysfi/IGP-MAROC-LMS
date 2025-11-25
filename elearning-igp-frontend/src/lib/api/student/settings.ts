import axiosInstance from '../axios';

export interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  student_id: string;
  group: string;
  bio: string;
  linkedin: string;
  github: string;
  avatar?: string;
}

export interface NotificationSettings {
  email_new_grade: boolean;
  email_new_resource: boolean;
  email_session_reminder: boolean;
  email_deadline_reminder: boolean;
  push_new_grade: boolean;
  push_session_start: boolean;
  push_new_document: boolean;
  push_announcements: boolean;
}

export interface Preferences {
  language: string;
  timezone: string;
  date_format: string;
  theme: string;
  email_frequency: string;
}

export const studentSettingsApi = {
  getProfile: () => 
    axiosInstance.get<{ data: ProfileData }>('/student/settings/profile'),

  updateProfile: (data: Partial<ProfileData>) => 
    axiosInstance.put('/student/settings/profile', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosInstance.post('/student/settings/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  changePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) => 
    axiosInstance.post('/student/settings/password', data),

  getNotifications: () => 
    axiosInstance.get<{ data: NotificationSettings }>('/student/settings/notifications'),

  updateNotifications: (data: NotificationSettings) => 
    axiosInstance.put('/student/settings/notifications', data),

  getPreferences: () => 
    axiosInstance.get<{ data: Preferences }>('/student/settings/preferences'),

  updatePreferences: (data: Preferences) => 
    axiosInstance.put('/student/settings/preferences', data),

  toggle2FA: () => 
    axiosInstance.post('/student/settings/2fa/toggle'),
};