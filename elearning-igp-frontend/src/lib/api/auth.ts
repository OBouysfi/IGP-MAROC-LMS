import apiClient from './client';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {
  LoginRequest,
  LoginResponse,
  VerifyTwoFactorRequest,
  VerifyTwoFactorResponse,
  RegisterRequest,
  User,
} from '@/types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    
    // Si l'utilisateur est retourné (pas de 2FA), stocker ses infos
    if (response.data.user && !response.data.requires_2fa) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
    }
    
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  verifyTwoFactor: async (data: VerifyTwoFactorRequest): Promise<VerifyTwoFactorResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_2FA, data);
    
    // Stocker le token et les infos utilisateur après vérification 2FA
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  resendTwoFactor: async (email: string) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_2FA, { email });
    return response.data;
  },

  logout: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } finally {
      // Toujours nettoyer le localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  me: async (): Promise<{ user: User }> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    
    // Mettre à jour les infos utilisateur en cache
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (data: { 
    email: string; 
    password: string; 
    password_confirmation: string; 
    token: string 
  }) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  // Fonction utilitaire pour récupérer le rôle de l'utilisateur
  getUserRole: (): string | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return user.role || null;
    } catch {
      return null;
    }
  },

  // Fonction utilitaire pour vérifier si l'utilisateur est authentifié
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },
};