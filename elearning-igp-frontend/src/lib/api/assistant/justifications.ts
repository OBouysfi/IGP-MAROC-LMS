import apiClient from '../client';

export interface Justification {
  id: number;
  student_name: string;
  student_email: string;
  group: string;
  absence_date: string;
  absence_course: string;
  reason: string;
  document_name: string;
  document_url: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  comment: string;
}

export interface Group {
  id: number;
  name: string;
  code: string;
}

export const assistantJustificationApi = {
  getAll: async (status?: string, groupId?: number): Promise<Justification[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (groupId) params.append('group_id', groupId.toString());
    const response = await apiClient.get(`/assistant/justifications?${params}`);
    return response.data;
  },

  approve: async (id: number, comment?: string) => {
    const response = await apiClient.post(`/assistant/justifications/${id}/approve`, { comment });
    return response.data;
  },

  reject: async (id: number, comment: string) => {
    const response = await apiClient.post(`/assistant/justifications/${id}/reject`, { comment });
    return response.data;
  },

  download: async (id: number) => {
    const response = await apiClient.get(`/assistant/justifications/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getGroups: async (): Promise<Group[]> => {
    const response = await apiClient.get('/assistant/justifications/groups');
    return response.data;
  },
};