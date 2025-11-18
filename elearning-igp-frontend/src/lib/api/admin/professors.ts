import axiosInstance from '../axios';

export interface Professor {
  id: number;
  user_id: number;
  professor_code: string;
  gender: string | null;
  birth_date: string | null;
  nationality: string | null;
  address: string | null;
  hire_date: string | null;
  department: string | null;
  specialization: string | null;
  contract_type: string;
  hourly_rate: number;
  total_hours_month: number;
  qualifications: string[];
  bio: string | null;
  created_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
  };
}

export interface ProfessorStats {
  total_professors: number;
  active_professors: number;
  inactive_professors: number;
  new_this_semester: number;
}

export interface ProfessorFilters {
  search?: string;
  department?: string;
  contract_type?: string;
  status?: string;
}

export const professorsApi = {
  getAll: (params?: ProfessorFilters) => 
    axiosInstance.get('/admin/professors', { params }),
  getStats: () => 
    axiosInstance.get('/admin/professors/stats'),
  show: (id: number) => 
    axiosInstance.get(`/admin/professors/${id}`),
  create: (data: any) => 
    axiosInstance.post('/admin/professors', data),
  update: (id: number, data: any) => 
    axiosInstance.put(`/admin/professors/${id}`, data),
  delete: (id: number) => 
    axiosInstance.delete(`/admin/professors/${id}`),
  toggleActive: (id: number) => 
    axiosInstance.post(`/admin/professors/${id}/toggle-active`),
};