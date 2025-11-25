import axiosInstance from '../axios';

export interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  bio: string;
  linkedin: string;
  github: string;
  avatar?: string;
}

export interface NotificationSettings {
  email_new_student: boolean;
  email_grade_reminder: boolean;
  email_session_reminder: boolean;
  email_document_download: boolean;
  push_new_message: boolean;
  push_session_start: boolean;
  push_grade_deadline: boolean;
}

export interface Preferences {
  language: string;
  timezone: string;
  date_format: string;
  theme: string;
  default_session_duration: number;
  auto_share_documents: boolean;
}

export const professorSettingsApi = {
  getProfile: () => 
    axiosInstance.get<{ data: ProfileData }>('/professor/settings/profile'),
  
  updateProfile: (data: Partial<ProfileData>) => 
    axiosInstance.put('/professor/settings/profile', data),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosInstance.post('/professor/settings/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  changePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) => 
    axiosInstance.post('/professor/settings/password', data),
  
  getNotifications: () => 
    axiosInstance.get<{ data: NotificationSettings }>('/professor/settings/notifications'),
  
  updateNotifications: (data: NotificationSettings) => 
    axiosInstance.put('/professor/settings/notifications', data),
  
  getPreferences: () => 
    axiosInstance.get<{ data: Preferences }>('/professor/settings/preferences'),
  
  updatePreferences: (data: Preferences) => 
    axiosInstance.put('/professor/settings/preferences', data),
  
  toggle2FA: () => 
    axiosInstance.post('/professor/settings/2fa/toggle'),
};