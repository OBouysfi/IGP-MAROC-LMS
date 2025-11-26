import apiClient from '../client';

export interface MonthlyStats {
  total_absences: number;
  justified: number;
  unjustified: number;
  total_delays: number;
  absence_rate: number;
  top_absent_course: string;
  most_absent_day: string;
}

export interface GroupStat {
  group: string;
  absences: number;
  rate: number;
  students: number;
}

export interface RecentReport {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
}

export interface Group {
  id: number;
  name: string;
  code: string;
}

export const assistantReportApi = {
  getStats: async (month?: string): Promise<{ monthly_stats: MonthlyStats; group_stats: GroupStat[] }> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    const response = await apiClient.get(`/assistant/reports/stats?${params}`);
    return response.data;
  },

  generate: async (type: string, month: string, groupId?: number) => {
    const response = await apiClient.post('/assistant/reports/generate', {
      type,
      month,
      group_id: groupId,
    });
    return response.data;
  },

  getRecent: async (): Promise<RecentReport[]> => {
    const response = await apiClient.get('/assistant/reports/recent');
    return response.data;
  },

  getGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/assistant/reports/groups');
    return response.data;
  },
};