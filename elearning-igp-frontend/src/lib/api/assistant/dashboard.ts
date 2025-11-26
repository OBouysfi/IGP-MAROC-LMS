import apiClient from '../client';

export const assistantDashboardApi = {
  getStats: async () => {
    const response = await apiClient.get('/assistant/dashboard/stats');
    return response.data;
  },

  getTodayAbsences: async () => {
    const response = await apiClient.get('/assistant/dashboard/today-absences');
    return response.data;
  },

  getPendingJustifications: async () => {
    const response = await apiClient.get('/assistant/dashboard/pending-justifications');
    return response.data;
  },

  getTopAbsentStudents: async () => {
    const response = await apiClient.get('/assistant/dashboard/top-absent-students');
    return response.data;
  },

  getWeeklyStats: async () => {
    const response = await apiClient.get('/assistant/dashboard/weekly-stats');
    return response.data;
  },
};