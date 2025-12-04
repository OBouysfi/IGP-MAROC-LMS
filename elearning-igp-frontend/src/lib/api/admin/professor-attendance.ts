import axiosInstance from '../axios';

export interface ProfessorAttendanceLog {
  id: number;
  professor: {
    id: number;
    name: string;
    email: string;
  };
  course: {
    id: number | null;
    name: string;
  };
  group: {
    id: number | null;
    name: string;
  };
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  hours_worked: number;
  hours_scheduled: number;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  type: 'cours' | 'td' | 'tp' | 'session_live';
  location: string;
  notes: string | null;
  validated: boolean;
 rejected: boolean;
  rejection_reason: string | null;
  validated_by: number | null;
  validated_at: string | null;
}

export interface ProfessorAttendanceStats {
  total_logs: number;
  validated: number;
  pending: number;
  absences: number;
  total_hours: number;
}

export interface Professor {
  id: number;
  name: string;
  email: string;
}

export const professorAttendanceApi = {
  // Stats
  getStats: (params?: { month?: number; year?: number }) =>
    axiosInstance.get('/admin/professor-attendance/stats', { params }),

  // Liste pointages
  getAll: (params?: {
    professor_id?: number;
    status?: 'pending' | 'validated' | 'absent';
    date_from?: string;
    date_to?: string;
    type?: string;
    per_page?: number;
    page?: number;
  }) => axiosInstance.get('/admin/professor-attendance', { params }),

  // Pointages d'un prof
  getProfessorAttendance: (professorId: number, params?: { month?: number; year?: number }) =>
    axiosInstance.get(`/admin/professor-attendance/professor/${professorId}`, { params }),

  // Valider pointages
  validate: (logIds: number[]) =>
    axiosInstance.post('/admin/professor-attendance/validate', { log_ids: logIds }),

  // Rejeter pointage
  reject: (logId: number, reason: string) =>
    axiosInstance.post(`/admin/professor-attendance/${logId}/reject`, { reason }),

  // Marquer absent manuellement
  markAbsent: (data: {
    professor_id: number;
    schedule_id: number;
    date: string;
    reason?: string;
  }) => axiosInstance.post('/admin/professor-attendance/mark-absent', data),

  // Liste professeurs
  getProfessors: () => axiosInstance.get('/admin/professor-attendance/professors'),
};