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
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  verifyTwoFactor: async (data: VerifyTwoFactorRequest): Promise<VerifyTwoFactorResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_2FA, data);
    return response.data;
  },

  resendTwoFactor: async (email: string) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_2FA, { email });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  me: async (): Promise<{ user: User }> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (data: { email: string; password: string; password_confirmation: string; token: string }) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },
};