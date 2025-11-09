import axios, { AxiosError, AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Ne rediriger QUE si :
    // 1. C'est une erreur 401
    // 2. Ce n'est PAS une requête de login/register/2fa
    // 3. L'utilisateur n'est pas déjà sur une page de login
    
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthRequest = requestUrl.includes('/auth/login') || 
                           requestUrl.includes('/auth/register') || 
                           requestUrl.includes('/auth/2fa');
      
      const currentPath = window.location.pathname;
      const isOnLoginPage = currentPath.includes('/login');
      
      // Rediriger uniquement si on est sur une page protégée avec un token expiré
      if (!isAuthRequest && !isOnLoginPage) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        
        // Rediriger vers la bonne page de login selon l'espace
        if (currentPath.includes('/admin')) {
          window.location.href = '/admin/login';
        } else if (currentPath.includes('/professor')) {
          window.location.href = '/professor/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;