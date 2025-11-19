import axiosInstance from '../axios';

export interface Program {
  id: number;
  name: string;
  code: string;
  description?: string;
  duration_years: number;
  levels: string[];
  inscription_fee: number;
  monthly_fee: number;
  requirements: string[];
  total_students?: number;
  total_groups?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Filiere {
  id: number;
  name: string;
  code: string;
  description?: string;
  program_ids: number[];
  programs: string[];
  total_students?: number;
  total_courses?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramStats {
  total_programs: number;
  active_programs: number;
  total_students: number;
  total_revenue: number;
}

export interface FiliereStats {
  total_filieres: number;
  active_filieres: number;
}

export const programsApi = {
  getAll: (params?: { search?: string }) => 
    axiosInstance.get('/admin/programs', { params }),
  getStats: () => 
    axiosInstance.get('/admin/programs/stats'),
  show: (id: number) => 
    axiosInstance.get(`/admin/programs/${id}`),
  create: (data: any) => 
    axiosInstance.post('/admin/programs', data),
  update: (id: number, data: any) => 
    axiosInstance.put(`/admin/programs/${id}`, data),
  delete: (id: number) => 
    axiosInstance.delete(`/admin/programs/${id}`),
};

export const filieresApi = {
  getAll: (params?: { search?: string }) => 
    axiosInstance.get('/admin/filieres', { params }),
  getStats: () => 
    axiosInstance.get('/admin/filieres/stats'),
  show: (id: number) => 
    axiosInstance.get(`/admin/filieres/${id}`),
  create: (data: any) => 
    axiosInstance.post('/admin/filieres', data),
  update: (id: number, data: any) => 
    axiosInstance.put(`/admin/filieres/${id}`, data),
  delete: (id: number) => 
    axiosInstance.delete(`/admin/filieres/${id}`),
};