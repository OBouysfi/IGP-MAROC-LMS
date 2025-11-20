import axiosInstance from '../axios';

export interface ScheduleSlot {
  id: number;
  course: {
    id: number;
    name: string;
    code: string;
  };
  group: {
    id: number;
    name: string;
    code: string;
  };
  professor: {
    id: number;
    name: string;
  } | null;
  room: string;
  day: string;
  start_time: string;
  end_time: string;
  type: 'cours' | 'td' | 'tp' | 'examen';
  start_date?: string;
  end_date?: string;
  is_recurring: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleFormData {
  course_id: number;
  group_id: number;
  professor_id?: number;
  room: string;
  day: string;
  start_time: string;
  end_time: string;
  type: 'cours' | 'td' | 'tp' | 'examen';
  start_date?: string;
  end_date?: string;
  is_recurring?: boolean;
  notes?: string;
}

export interface ScheduleFilters {
  group_id?: number;
  professor_id?: number;
  room?: string;
  day?: string;
  type?: string;
}

export interface ScheduleStats {
  total_schedules: number;
  by_type: {
    cours: number;
    td: number;
    tp: number;
    examen: number;
  };
  total_hours_week: number;
  rooms_used: number;
}

export const schedulesApi = {
  getAll: (params?: ScheduleFilters) => 
    axiosInstance.get('/admin/schedules', { params }),
  
  getStats: () => 
    axiosInstance.get('/admin/schedules/stats'),
  
  getGroups: () => 
    axiosInstance.get('/admin/schedules/groups'),
  
  getProfessors: () => 
    axiosInstance.get('/admin/schedules/professors'),
  
  getRooms: () => 
    axiosInstance.get('/admin/schedules/rooms'),
  
  checkConflicts: (data: any) => 
    axiosInstance.post('/admin/schedules/check-conflicts', data),
  
  show: (id: number) => 
    axiosInstance.get(`/admin/schedules/${id}`),
  
  create: (data: ScheduleFormData) => 
    axiosInstance.post('/admin/schedules', data),
  
  update: (id: number, data: ScheduleFormData) => 
    axiosInstance.put(`/admin/schedules/${id}`, data),
  
  delete: (id: number) => 
    axiosInstance.delete(`/admin/schedules/${id}`),
};