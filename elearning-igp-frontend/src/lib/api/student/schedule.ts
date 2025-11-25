import apiClient from '../client';

export interface StudentSchedule {
  id: number;
  course: string;
  course_code: string;
  professor: string;
  type: 'cours' | 'tp' | 'td' | 'examen';
  day: string;
  start_time: string;
  end_time: string;
  room: string;
}

export const studentScheduleApi = {
  getAll: async (): Promise<StudentSchedule[]> => {
    const response = await apiClient.get('/student/schedule');
    return response.data;
  },
};