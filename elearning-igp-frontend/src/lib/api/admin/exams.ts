import axiosInstance from '../axios';

export interface Exam {
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
  filiere: string;
  program: string;
  type: 'partiel' | 'final' | 'rattrapage' | 'controle';
  date: string;
  time: string;
  duration: string;
  room: string;
  total_students: number;
  graded_students: number;
  average: number | null;
  min_grade: number | null;
  max_grade: number | null;
  pass_rate: number | null;
  status: 'planifié' | 'en_cours' | 'terminé' | 'notes_saisies' | 'validé';
  grades?: {
    id: number;
    student: string;
    student_id: number;
    grade: number;
    status: string;
    comment?: string;
  }[];
  created_at?: string;
  updated_at?: string;
}

export interface ExamStats {
  total_exams: number;
  upcoming_exams: number;
  pending_grades: number;
  validated_grades: number;
  global_average: number | string | null;
  global_pass_rate: number | string | null;
}

export interface ExamFilters {
  search?: string;
  status?: string;
  filiere?: string;
  type?: string;
}

export const examsApi = {
  getAll: (params?: ExamFilters) => 
    axiosInstance.get('/admin/exams', { params }),
  
  getStats: () => 
    axiosInstance.get('/admin/exams/stats'),
  
  getStatsByFiliere: () => 
    axiosInstance.get('/admin/exams/stats-by-filiere'),
  
  show: (id: number) => 
    axiosInstance.get(`/admin/exams/${id}`),
  
  create: (data: any) => 
    axiosInstance.post('/admin/exams', data),
  
  update: (id: number, data: any) => 
    axiosInstance.put(`/admin/exams/${id}`, data),
  
  delete: (id: number) => 
    axiosInstance.delete(`/admin/exams/${id}`),
  
  saveGrades: (id: number, grades: any[]) => 
    axiosInstance.post(`/admin/exams/${id}/grades`, { grades }),
  
  validateGrades: (id: number) => 
    axiosInstance.post(`/admin/exams/${id}/validate`),
};