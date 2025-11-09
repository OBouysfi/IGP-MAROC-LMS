import axiosInstance from './axios';

export const dashboardApi = {
  getStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard/stats');
    return response.data;
  }
};