import apiClient from '../client';

export interface StudentGrade {
  id: number;
  course: string;
  course_code: string;
  exam_type: 'partiel' | 'final' | 'controle' | 'tp' | 'projet' | 'quiz';
  exam_name: string;
  grade: number;
  max_grade: number;
  coefficient: number;
  date: string;
  comment: string;
  professor: string;
}

export interface CourseAverage {
  course: string;
  course_code: string;
  average: number;
  grades_count: number;
  coefficient: number;
  semester: string;
}

export const studentGradesApi = {
  getAll: async (): Promise<StudentGrade[]> => {
    const response = await apiClient.get('/student/grades');
    return response.data;
  },

  getSummary: async (): Promise<CourseAverage[]> => {
    const response = await apiClient.get('/student/grades/summary');
    return response.data;
  },
};