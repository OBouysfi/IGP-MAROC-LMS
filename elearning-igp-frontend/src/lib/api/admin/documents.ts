import axiosInstance from '../axios';

export interface Document {
  id: number | null;
  name: string;
  type: string;
  status: 'validé' | 'en_attente' | 'rejeté' | 'manquant';
  file_path?: string | null;
  uploaded_at: string | null;
  validated_at: string | null;
  comment: string | null;
}

export interface StudentDossier {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  program: string;
  filiere: string;
  group: string;
  dossier_status: 'complet' | 'incomplet' | 'en_attente';
  documents_required: number;
  documents_provided: number;
  documents_validated: number;
  last_update: string;
  documents: Document[];
}

export interface DocumentStats {
  total_dossiers: number;
  complete_dossiers: number;
  incomplete_dossiers: number;
  pending_validation: number;
}

export const documentsApi = {
  getStats: () => 
    axiosInstance.get('/admin/documents/stats'),
  
  getDossiers: (params?: any) => 
    axiosInstance.get('/admin/documents/dossiers', { params }),
  
  getRequiredDocuments: () => 
    axiosInstance.get('/admin/documents/required'),
  
  upload: (data: FormData) => 
    axiosInstance.post('/admin/documents/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  validate: (id: number, data: { status: string; comment?: string }) => 
    axiosInstance.post(`/admin/documents/${id}/validate`, data),
  
  delete: (id: number) => 
    axiosInstance.delete(`/admin/documents/${id}`),
  
  download: (id: number) => 
    axiosInstance.get(`/admin/documents/${id}/download`, {
      responseType: 'blob'
    }),
};