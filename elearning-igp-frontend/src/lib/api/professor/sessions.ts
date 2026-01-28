import axiosInstance from '../axios';

export interface Session {
  id: number;
  title: string;
  course: string;
  course_code: string;
  group: string;
  description: string;
  date: string;
  start_time: string;
  duration: string;
  status: 'planifiée' | 'en_cours' | 'terminée' | 'annulée';
  max_participants: number;
  registered_participants: number;
  joined_participants: number;
  room_url: string;
  recording_enabled: boolean;
  chat_enabled: boolean;
}

export interface SessionsStats {
  total_sessions: number;
  upcoming: number;
  live_now: number;
  completed: number;
  total_participants: number;
}

export interface CourseOption {
  id: number;
  name: string;
  code: string;
  groups: { id: number; name: string }[];
}

export interface CreateSessionInput {
  title: string;
  course_id: number;
  group_id: number;
  description?: string;
  session_date: string;
  start_time: string;
  duration: number;
  max_participants: number;
  recording_enabled?: boolean;
  chat_enabled?: boolean;
}

export const professorSessionsApi = {
  getStats: () => axiosInstance.get<{ data: SessionsStats }>('/professor/sessions/stats'),
  
  getSessions: (params?: { course?: string; status?: string }) => 
    axiosInstance.get<{ data: Session[] }>('/professor/sessions', { params }),
  
  getMyCourses: () => 
    axiosInstance.get<{ data: CourseOption[] }>('/professor/sessions/my-courses'),
  
  createSession: (data: CreateSessionInput) => 
    axiosInstance.post('/professor/sessions', data),
  
  startSession: (id: number) => 
    axiosInstance.post(`/professor/sessions/${id}/start`),
  
  getJoinUrl: (id: number) => 
    axiosInstance.get<{ join_url: string }>(`/professor/sessions/${id}/join`),
  
  endSession: (id: number) => 
    axiosInstance.post(`/professor/sessions/${id}/end`),

  deleteSession: (id: number) => 
    axiosInstance.delete(`/professor/sessions/${id}`),
};