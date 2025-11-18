import axiosInstance from '../axios';

export interface Student {
  id: number;
  user_id: number;
  student_code: string;
  gender: string | null;
  birth_date: string | null;
  nationality: string | null;
  address: string | null;
  enrolled_date: string | null;
  filiere: string | null;
  program: string | null;
  level: string | null;
  group: string | null;
  dossier_status: string;
  documents: string[] | null;
  admin_comments: string | null;
  inscription_amount: number;
  monthly_amount: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
  };
}

export interface StudentStats {
  total_students: number;
  active_students: number;
  inactive_students: number;
  new_this_month: number;
}

export interface StudentFilters {
  search?: string;
  filiere?: string;
  nationality?: string;
  program?: string;
  status?: string;
}

export const studentsApi = {
  getAll: (params?: StudentFilters) => 
    axiosInstance.get('/admin/students', { params }),
  getStats: () => 
    axiosInstance.get('/admin/students/stats'),
  show: (id: number) => 
    axiosInstance.get(`/admin/students/${id}`),
  create: (data: any) => 
    axiosInstance.post('/admin/students', data),
  update: (id: number, data: any) => 
    axiosInstance.put(`/admin/students/${id}`, data),
  delete: (id: number) => 
    axiosInstance.delete(`/admin/students/${id}`),
  toggleActive: (id: number) => 
    axiosInstance.post(`/admin/students/${id}/toggle-active`),
};