import axiosInstance from '../axios';

export interface CourseDetail {
  course: string;
  hours: number;
  group: string;
}

export interface ProfessorPayroll {
  id: number;
  professor_id: number;
  professor_name: string;
  professor_email: string;
  department: string;
  contract_type: string;
  bank_info: string;
  month: number;
  year: number;
  hourly_rate: number;
  hours_worked: number;
  bonus: number;
  deductions: number;
  gross_salary: number;
  net_salary: number;
  payment_status: 'payé' | 'en_attente' | 'en_cours';
  payment_date: string | null;
  payment_reference: string | null;
  payment_method: string | null;
  comment?: string | null;
  courses_details: CourseDetail[];
}

export interface PaymentHistory {
  id: number;
  month: string;
  year: number;
  professor_name: string;
  amount: number;
  payment_date: string;
  reference: string;
}

export interface PayrollStats {
  total_to_pay: number;
  total_hours: number;
  professors_count: number;
  paid_count: number;
  pending_count: number;
}

export const payrollsApi = {
  getStats: (month: number, year: number) =>
    axiosInstance.get('/admin/payrolls/stats', { params: { month, year } }),

  getAll: (params?: any) =>
    axiosInstance.get('/admin/payrolls', { params }),

  generate: (month: number, year: number) =>
    axiosInstance.post('/admin/payrolls/generate', { month, year }),

  update: (id: number, data: { bonus?: number; deductions?: number }) =>
    axiosInstance.put(`/admin/payrolls/${id}`, data),

  confirmPayment: (id: number, data: {
    payment_date: string;
    payment_reference: string;
    payment_method: string;
    comment?: string;
  }) => axiosInstance.post(`/admin/payrolls/${id}/pay`, data),

  confirmMultiplePayments: (data: {
    ids: number[];
    payment_date: string;
    payment_method: string;
  }) => axiosInstance.post('/admin/payrolls/pay-multiple', data),

  getHistory: (params?: any) =>
    axiosInstance.get('/admin/payrolls/history', { params }),

  getDepartments: () =>
    axiosInstance.get('/admin/payrolls/departments'),
};