import apiClient from '../client';

export interface Student {
  id: number;
  name: string;
  email: string;
  group: string;
  status: 'present' | 'absent' | 'late' | 'excused' | null;
}

export interface CourseSession {
  id: number;
  course: string;
  course_code: string;
  professor: string;
  group: string;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  students: Student[];
}

export interface Group {
  id: number;
  name: string;
  code: string;
}

export const assistantAttendanceApi = {
  getSessions: async (date: string, groupId?: number): Promise<CourseSession[]> => {
    const params = new URLSearchParams({ date });
    if (groupId) params.append('group_id', groupId.toString());
    const response = await apiClient.get(`/assistant/attendances/sessions?${params}`);
    return response.data;
  },

  saveAttendance: async (scheduleId: number, date: string, attendance: Array<{ student_id: number; status: string }>) => {
    const response = await apiClient.post('/assistant/attendances/save', {
      schedule_id: scheduleId,
      date,
      attendance,
    });
    return response.data;
  },

  getGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/assistant/attendances/groups');
    return response.data;
  },
};