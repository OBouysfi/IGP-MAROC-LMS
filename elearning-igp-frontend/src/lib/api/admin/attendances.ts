import axiosInstance from '../axios';

export interface Absence {
  id: number;
  date: string;
  course: string;
  start_time: string;
  end_time: string;
  type: 'absent' | 'retard' | 'justifié';
  justification: string | null;
  justification_file?: string | null;
  justified_at: string | null;
  comment?: string | null;
}

export interface StudentAttendance {
  id: number;
  student_name: string;
  student_email: string;
  group: string;
  filiere: string;
  total_absences: number;
  total_retards: number;
  justified_absences: number;
  attendance_rate: number;
  absences: Absence[];
}

export interface ProfessorAttendance {
  id: number;
  professor_name: string;
  professor_email: string;
  department: string;
  total_absences: number;
  total_retards: number;
  justified_absences: number;
  attendance_rate: number;
  absences: Absence[];
}

export interface AttendanceStats {
  total_students: number;
  present_today: number;
  absent_today: number;
  late_today: number;
  global_attendance_rate: number;
}

export const attendancesApi = {
  getStats: () => 
    axiosInstance.get('/admin/attendances/stats'),
  
  getStudentsAttendance: (params?: any) => 
    axiosInstance.get('/admin/attendances/students', { params }),
  
  getProfessorsAttendance: (params?: any) => 
    axiosInstance.get('/admin/attendances/professors', { params }),
  
  getGroups: () => 
    axiosInstance.get('/admin/attendances/groups'),
  
  getDepartments: () => 
    axiosInstance.get('/admin/attendances/departments'),
  
  getStudentsByGroup: (groupId: number) => 
    axiosInstance.get(`/admin/attendances/students-by-group/${groupId}`),
  
  getProfessorsByDepartment: (department: string) => 
    axiosInstance.get(`/admin/attendances/professors-by-department/${department}`),
  
  create: (data: any) => 
    axiosInstance.post('/admin/attendances', data),
  
  update: (id: number, data: any) => 
    axiosInstance.put(`/admin/attendances/${id}`, data),
  
  delete: (id: number) => 
    axiosInstance.delete(`/admin/attendances/${id}`),
  
  justify: (id: number, data: FormData) => 
    axiosInstance.post(`/admin/attendances/${id}/justify`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};