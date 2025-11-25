// src/lib/api/student/courses.ts
import apiClient from '../client';

export interface StudentCourse {
  id: number;
  name: string;
  code: string;
  professor: string;
  professor_email: string;
  description: string;
  credits: number;
  semester: string;
  progress: number;
  total_hours: number;
  completed_hours: number;
  next_class: string | null;
  next_class_room: string;
  grade_average: number | null;
  resources_count: number;
  sessions_count: number;
  color: string;
}

export interface CourseResource {
  id: number;
  title: string;
  description: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  shared_at: string;
  professor: string;
}

export const studentCoursesApi = {
  getAll: async (): Promise<StudentCourse[]> => {
    const response = await apiClient.get('/student/courses');
    return response.data;
  },

  getById: async (id: number): Promise<StudentCourse> => {
    const response = await apiClient.get(`/student/courses/${id}`);
    return response.data;
  },

  getResources: async (courseId: number): Promise<CourseResource[]> => {
    const response = await apiClient.get(`/student/courses/${courseId}/resources`);
    return response.data;
  },
};