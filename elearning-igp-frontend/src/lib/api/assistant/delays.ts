// src/lib/api/assistant/delays.ts
import apiClient from '../client';

export interface Delay {
  id: number;
  student_name: string;
  student_email: string;
  group: string;
  course: string;
  date: string;
  scheduled_time: string;
  arrival_time: string;
  delay_minutes: number;
  justified: boolean;
  reason: string;
}

export interface Group {
  id: number;
  name: string;
  code: string;
}

export const assistantDelayApi = {
  getAll: async (groupId?: number, date?: string): Promise<Delay[]> => {
    const params = new URLSearchParams();
    if (groupId) params.append('group_id', groupId.toString());
    if (date) params.append('date', date);
    const response = await apiClient.get(`/assistant/delays?${params}`);
    return response.data;
  },

  justify: async (id: number, reason?: string) => {
    const response = await apiClient.post(`/assistant/delays/${id}/justify`, { reason });
    return response.data;
  },

  getGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/assistant/delays/groups');
    return response.data;
  },
};