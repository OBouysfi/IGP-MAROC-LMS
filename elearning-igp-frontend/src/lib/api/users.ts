import axiosInstance from './axios';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  roles: Array<{ name: string }>;
}

export const usersApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  }
};