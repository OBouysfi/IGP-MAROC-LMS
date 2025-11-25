// src/lib/api/professor/students.ts
import axiosInstance from '../axios';

export interface StudentAttendance {
  total_sessions: number;
  attended: number;
  absences: number;
  rate: number;
}

export interface StudentGrade {
  course: string;
  grade: number;
  type: string;
  date: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  group: string;
  filiere: string;
  program: string;
  photo: string | null;
  courses: string[];
  average: number;
  attendance: StudentAttendance;
  grades: StudentGrade[];
  status: 'excellent' | 'good' | 'average' | 'at_risk';
}

export interface StudentsStats {
  total: number;
  excellent: number;
  good: number;
  average: number;
  at_risk: number;
}

export const professorStudentsApi = {
  getStats: () => axiosInstance.get<{ data: StudentsStats }>('/professor/students/stats'),
  
  getStudents: (params?: { search?: string; course?: string; group?: string }) => 
    axiosInstance.get<{ data: Student[] }>('/professor/students', { params }),
  
  getMyCourses: () => 
    axiosInstance.get<{ data: string[] }>('/professor/students/my-courses'),
  
  getMyGroups: () => 
    axiosInstance.get<{ data: string[] }>('/professor/students/my-groups'),
};