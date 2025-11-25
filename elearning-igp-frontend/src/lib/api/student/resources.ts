import apiClient from '../client';

export interface StudentResource {
  id: number;
  title: string;
  description: string;
  type: 'article' | 'video' | 'tutorial' | 'documentation' | 'tool' | 'book';
  course: string;
  course_code: string;
  professor: string;
  url: string;
  is_external: boolean;
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  duration: string;
  rating: number;
  views: number;
  added_at: string;
  tags: string[];
}

export const studentResourcesApi = {
  getAll: async (): Promise<StudentResource[]> => {
    const response = await apiClient.get('/student/resources');
    return response.data;
  },
};