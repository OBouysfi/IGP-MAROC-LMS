import apiClient from '../client';

export interface StudentDocument {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'video' | 'image' | 'zip';
  size: string;
  course: string;
  course_code: string;
  professor: string;
  category: 'cours' | 'tp' | 'correction' | 'ressource' | 'examen';
  uploaded_at: string;
  downloads: number;
  is_new: boolean;
  file_path: string;
}

export const studentDocumentsApi = {
  getAll: async (): Promise<StudentDocument[]> => {
    const response = await apiClient.get('/student/documents');
    return response.data;
  },

  download: async (documentId: number): Promise<Blob> => {
    const response = await apiClient.get(`/student/documents/${documentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};