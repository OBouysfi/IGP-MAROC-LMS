import axiosInstance from '../axios';

export interface ScheduleEvent {
  id: number | string;
  course: string;
  course_code: string;
  group: string;
  type: 'cours' | 'tp' | 'td' | 'examen' | 'session_live';
  day: string;
  start_time: string;
  end_time: string;
  room: string;
  students_count: number;
}

export interface ScheduleStats {
  total_hours: number;
  total_courses: number;
  total_groups: number;
  sessions_this_week: number;
}

export const professorScheduleApi = {
  getSchedule: (params?: { week_offset?: number }) => 
    axiosInstance.get<{ data: ScheduleEvent[] }>('/professor/schedule', { params }),
  
  getStats: () => 
    axiosInstance.get<{ data: ScheduleStats }>('/professor/schedule/stats'),
};