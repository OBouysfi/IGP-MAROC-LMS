import axiosInstance from '../axios';

export interface Document {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'video' | 'image' | 'zip';
  size: string;
  course: string;
  course_code: string;
  category: 'cours' | 'tp' | 'examen' | 'correction' | 'ressource';
  uploaded_at: string;
  downloads: number;
  shared_with_students: boolean;
  file_url: string;
}

export interface DocumentsStats {
  total_documents: number;
  total_size: string;
  shared_documents: number;
  total_downloads: number;
}

export interface CourseOption {
  id: number;
  name: string;
  code: string;
}

export const professorDocumentsApi = {
  getStats: () => 
    axiosInstance.get<{ data: DocumentsStats }>('/professor/documents/stats'),
  
  getDocuments: (params?: { course?: string; category?: string; type?: string; search?: string }) => 
    axiosInstance.get<{ data: Document[] }>('/professor/documents', { params }),
  
  getMyCourses: () => 
    axiosInstance.get<{ data: CourseOption[] }>('/professor/documents/my-courses'),
  
  uploadDocument: (formData: FormData) => 
    axiosInstance.post('/professor/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  toggleShare: (id: number) => 
    axiosInstance.post(`/professor/documents/${id}/toggle-share`),
  
  downloadDocument: (id: number) => 
    axiosInstance.get(`/professor/documents/${id}/download`),
  
  deleteDocument: (id: number) => 
    axiosInstance.delete(`/professor/documents/${id}`),
};