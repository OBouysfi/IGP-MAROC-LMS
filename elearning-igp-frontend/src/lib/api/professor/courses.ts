import axiosInstance from '../axios';

export interface CourseResource {
  id: number;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  size: string;
  uploaded_at: string;
  url?: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  group: string;
  filiere: string;
  program: string;
  total_students: number;
  total_hours: number;
  completed_hours: number;
  progress: number;
  schedule: string;
  room: string;
  next_class: string;
  average_attendance: number;
  resources: CourseResource[];
}

export interface CoursesStats {
  total_courses: number;
  total_students: number;
  completed_hours: number;
  total_resources: number;
}

export const professorCoursesApi = {
  getStats: () => axiosInstance.get<{ data: CoursesStats }>('/professor/courses/stats'),
  
  getCourses: (params?: { search?: string }) => 
    axiosInstance.get<{ data: Course[] }>('/professor/courses', { params }),
  
  getCourse: (id: number) => 
    axiosInstance.get<{ data: Course }>(`/professor/courses/${id}`),
  
  uploadResource: (courseId: number, data: FormData) => 
    axiosInstance.post(`/professor/courses/${courseId}/resources`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteResource: (courseId: number, resourceId: number) => 
    axiosInstance.delete(`/professor/courses/${courseId}/resources/${resourceId}`),
};