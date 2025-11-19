import axiosInstance from '../axios';

export interface GroupStudent {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

export interface GroupCourse {
  id: number;
  name: string;
  professor: string;
  hours_week: number;
}

export interface GroupSchedule {
  day: string;
  time: string;
  course: string;
  room: string;
}

export interface Group {
  id: number;
  name: string;
  code: string;
  program: string;
  level: string;
  filiere: string;
  academic_year?: string;
  max_students: number;
  delegate?: string;
  delegate_email?: string;
  students?: GroupStudent[];
  courses?: GroupCourse[];
  schedule?: GroupSchedule[];
  students_count?: number;
  courses_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GroupStats {
  total_groups: number;
  active_groups: number;
  avg_students: number;
  total_students: number;
}

export interface GroupFilters {
  search?: string;
  program?: string;
  filiere?: string;
  level?: string;
}

export const groupsApi = {
  getAll: (params?: GroupFilters) => 
    axiosInstance.get('/admin/groups', { params }),
  getStats: () => 
    axiosInstance.get('/admin/groups/stats'),
  show: (id: number) => 
    axiosInstance.get(`/admin/groups/${id}`),
  create: (data: any) => 
    axiosInstance.post('/admin/groups', data),
  update: (id: number, data: any) => 
    axiosInstance.put(`/admin/groups/${id}`, data),
  delete: (id: number) => 
    axiosInstance.delete(`/admin/groups/${id}`),
};