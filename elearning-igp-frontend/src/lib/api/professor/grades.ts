import axiosInstance from '../axios';

export interface StudentGrade {
  id: number;
  student_name: string;
  student_email: string;
  grade: number | null;
  comment: string;
  status: 'saved' | 'pending' | 'empty';
}

export interface Exam {
  id: number;
  course: string;
  course_code: string;
  group: string;
  type: 'partiel' | 'final' | 'controle' | 'tp' | 'projet';
  date: string;
  max_grade: number;
  coefficient: number;
  deadline: string;
  status: 'en_attente' | 'en_cours' | 'terminé' | 'validé';
  total_students: number;
  graded_students: number;
  students: StudentGrade[];
}

export interface GradesStats {
  total_exams: number;
  pending: number;
  in_progress: number;
  completed: number;
}

export interface GradeInput {
  student_id: number;
  grade: number | null;
  comment?: string;
}

export const professorGradesApi = {
  getStats: () => axiosInstance.get<{ data: GradesStats }>('/professor/grades/stats'),
  
  getExams: (params?: { course?: string; status?: string }) => 
    axiosInstance.get<{ data: Exam[] }>('/professor/grades', { params }),
  
  getMyCourses: () => 
    axiosInstance.get<{ data: string[] }>('/professor/grades/my-courses'),
  
  saveGrades: (examId: number, grades: GradeInput[]) => 
    axiosInstance.post(`/professor/grades/${examId}/save`, { grades }),
  
  submitGrades: (examId: number) => 
    axiosInstance.post(`/professor/grades/${examId}/submit`),
};