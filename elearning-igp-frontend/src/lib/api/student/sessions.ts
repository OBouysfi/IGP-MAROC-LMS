import apiClient from '../client';

export interface StudentSession {
  id: number;
  title: string;
  course: string;
  course_code: string;
  professor: string;
  description: string;
  date: string;
  start_time: string;
  duration: string;
  status: 'planifiée' | 'en_cours' | 'terminée' | 'annulée';
  room_url: string;
  join_url?: string;
  participants_count: number;
  max_participants: number;
  recording_available: boolean;
  recording_url: string | null;
  is_registered: boolean;
}

export const studentSessionsApi = {
  getAll: async (): Promise<StudentSession[]> => {
    const response = await apiClient.get('/student/sessions');
    return response.data;
  },

  join: async (sessionId: number): Promise<{ message: string; room_url: string; join_url: string }> => {
    const response = await apiClient.post(`/student/sessions/${sessionId}/join`);
    return response.data;
  },
};