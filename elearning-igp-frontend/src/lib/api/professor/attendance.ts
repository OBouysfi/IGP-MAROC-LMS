import axiosInstance from '../axios';

export const professorAttendanceApi = {
  // Emploi du temps de la semaine
  getWeekSchedule: (weekOffset: number = 0) => 
    axiosInstance.get(`/professor/schedule`, { params: { week_offset: weekOffset } }),

  // Pointer arrivée 
  clockIn: (payload: { schedule_id?: number; session_id?: number }) => 
    axiosInstance.post('/professor/attendance/clock-in', payload),

  // Pointer sortie
  clockOut: (logId: number) => 
    axiosInstance.post(`/professor/attendance/${logId}/clock-out`),

  // Mon historique
  myAttendance: (startDate?: string, endDate?: string) => 
    axiosInstance.get('/professor/attendance/my-attendance', { 
      params: { start_date: startDate, end_date: endDate } 
    }),
};