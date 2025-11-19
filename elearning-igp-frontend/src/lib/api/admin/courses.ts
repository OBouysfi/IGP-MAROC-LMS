
import axiosInstance from '../axios';

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string | null;
  program: string | null;
  level: string | null;
  filiere: string | null;
  professor: {
    id: number;
    name: string;
    email: string;
  } | null;
  students_count: number;
  max_students: number;
  hours_total: number;
  hours_completed: number;
  start_date: string | null;
  end_date: string | null;
  schedule: { day: string; time: string; room: string }[];
  status: string;
  materials: string[];
  completion_rate: number;
  credits: number;
  is_active: boolean;
  created_at: string;
}

export interface CourseStats {
  total_courses: number;
  active_courses: number;
  completed_courses: number;
  total_hours: number;
}

export interface CourseFilters {
  search?: string;
  program?: string;
  filiere?: string;
  status?: string;
}

export const coursesApi = {
  getAll: (params?: CourseFilters) => 
    axiosInstance.get('/admin/courses', { params }),
  getStats: () => 
    axiosInstance.get('/admin/courses/stats'),
  show: (id: number) => 
    axiosInstance.get(`/admin/courses/${id}`),
  create: (data: any) => 
    axiosInstance.post('/admin/courses', data),
  update: (id: number, data: any) => 
    axiosInstance.put(`/admin/courses/${id}`, data),
  delete: (id: number) => 
    axiosInstance.delete(`/admin/courses/${id}`),
  toggleActive: (id: number) => 
    axiosInstance.post(`/admin/courses/${id}/toggle-active`),
};