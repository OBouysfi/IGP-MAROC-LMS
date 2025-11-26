// src/lib/api/assistant/schedules.ts
import apiClient from '../client';

export interface ScheduleEvent {
  id: number;
  course: string;
  course_code: string;
  professor: string;
  group: string;
  type: 'cours' | 'tp' | 'td' | 'examen';
  day: string;
  start_time: string;
  end_time: string;
  room: string;
  students_count: number;
}

export interface Group {
  id: number;
  name: string;
  code: string;
}

export interface Professor {
  id: number;
  name: string;
}

export const assistantScheduleApi = {
  getAll: async (groupId?: number, professorId?: number): Promise<ScheduleEvent[]> => {
    const params = new URLSearchParams();
    if (groupId) params.append('group_id', groupId.toString());
    if (professorId) params.append('professor_id', professorId.toString());
    const response = await apiClient.get(`/assistant/schedules?${params}`);
    return response.data;
  },

  getGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/assistant/schedules/groups');
    return response.data;
  },

  getProfessors: async (): Promise<Professor[]> => {
    const response = await apiClient.get('/assistant/schedules/professors');
    return response.data;
  },
};