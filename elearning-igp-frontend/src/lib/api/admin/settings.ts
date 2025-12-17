import axiosInstance from '../axios';

export interface GeneralSettings {
  school_name: string;
  school_email: string;
  school_phone: string;
  school_address: string;
  academic_year: string;
  website: string;
  timezone: string;
  language: string;
  logo: string | null;
}

export interface AdminUser {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'assistant';
  is_active: boolean;
  created_at: string;
  last_login: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  users_count: number;
  color: string;
}

export interface SecuritySettings {
  enable_2fa: boolean;
  session_timeout: number;
  max_login_attempts: number;
  password_min_length: number;
  require_uppercase: boolean;
  require_numbers: boolean;
  require_special: boolean;
}

export interface Session {
  id: string;
  user_id: number;
  user_name: string;
  user_email: string;
  ip_address: string;
  device: { browser: string; os: string; device: string };
  last_activity: string;
  is_current: boolean;
}

export interface LoginLog {
  id: number;
  user_name: string;
  user_email: string;
  ip_address: string;
  device: { browser: string; os: string; device: string };
  status: string;
  reason: string | null;
  created_at: string;
}

export interface LoginAttempt {
  id: number;
  email: string;
  ip_address: string;
  device: { browser: string; os: string; device: string };
  successful: boolean;
  attempted_at: string;
}

export interface LockedUser {
  id: number;
  name: string;
  email: string;
  locked_at: string;
  locked_reason: string;
  failed_attempts: number;
}

export interface SessionsStats {
  active_sessions: number;
  today_logins: number;
  failed_attempts: number;
  locked_users: number;
}

export const settingsApi = {
  // General
  getGeneral: () => axiosInstance.get('/admin/settings/general'),
  updateGeneral: (data: Partial<GeneralSettings>) => axiosInstance.put('/admin/settings/general', data),
  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return axiosInstance.post('/admin/settings/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Admins & Assistants
  getAdmins: () => axiosInstance.get('/admin/settings/admins'),
  createAdmin: (data: { first_name: string; last_name: string; email: string; password: string; role: string }) =>
    axiosInstance.post('/admin/settings/admins', data),
  updateAdmin: (id: number, data: any) => axiosInstance.put(`/admin/settings/admins/${id}`, data),
  deleteAdmin: (id: number) => axiosInstance.delete(`/admin/settings/admins/${id}`),
  toggleAdminStatus: (id: number) => axiosInstance.patch(`/admin/settings/admins/${id}/toggle`),

  // Roles
  getRoles: () => axiosInstance.get('/admin/settings/roles'),

  // Security
  getSecurity: () => axiosInstance.get('/admin/settings/security'),
  updateSecurity: (data: SecuritySettings) => axiosInstance.put('/admin/settings/security', data),

    // Locked Users
  getLockedUsers: () => axiosInstance.get('/admin/settings/locked-users'),
  unlockUser: (id: number) => axiosInstance.post(`/admin/settings/users/${id}/unlock`),

  // Global Security Actions
  enableTwoFactorForAll: () => axiosInstance.post('/admin/settings/enable-2fa-all'),
  logoutAllUsers: () => axiosInstance.post('/admin/settings/logout-all-users'),

  // Sessions
  getSessionsStats: () => axiosInstance.get('/admin/settings/sessions/stats'),
  getSessions: () => axiosInstance.get('/admin/settings/sessions'),
  destroySession: (id: string) => axiosInstance.delete(`/admin/settings/sessions/${id}`),
  destroyAllSessions: () => axiosInstance.delete('/admin/settings/sessions/all'),

  // Login Logs & Attempts
  getLoginLogs: () => axiosInstance.get('/admin/settings/login-logs'),
  getLoginAttempts: () => axiosInstance.get('/admin/settings/login-attempts'),

  // Locked Users
  // getLoginLogs: () => axiosInstance.get('/admin/settings/login-logs'),
  // getLoginAttempts: () => axiosInstance.get('/admin/settings/login-attempts'),
};