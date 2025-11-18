import axios, { AxiosError, AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthRequest = requestUrl.includes('/auth/login') || 
                           requestUrl.includes('/auth/register') || 
                           requestUrl.includes('/auth/verify-2fa') ||
                           requestUrl.includes('/auth/resend-2fa');
      
      const currentPath = window.location.pathname;
      const isOnLoginPage = currentPath.includes('/login') || currentPath.includes('/verify-2fa');
      
      if (!isAuthRequest && !isOnLoginPage) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        
        if (currentPath.includes('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;