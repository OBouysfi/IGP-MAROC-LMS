// src/lib/api/student/dashboard.ts
import apiClient from '../client';

export interface DashboardStats {
  total_courses: number;
  average_grade: number;
  attendance_rate: number;
  upcoming_sessions: number;
  pending_assignments: number;
  completed_courses: number;
}

export interface TodaySchedule {
  id: number;
  course: string;
  professor: string;
  time: string;
  room: string;
  type: string;
}

export interface UpcomingSession {
  id: number;
  course: string;
  topic: string;
  date: string;
  time: string;
  professor: string;
}

export interface RecentGrade {
  id: number;
  course: string;
  exam: string;
  grade: number;
  max: number;
  date: string;
  status: string;
}

export interface MyCourse {
  id: number;
  name: string;
  code: string;
  professor: string;
  progress: number;
  next_class: string;
}

export interface RecentResource {
  id: number;
  name: string;
  course: string;
  type: string;
  date: string;
}

export interface PendingTask {
  id: number;
  task: string;
  course: string;
  deadline: string;
  priority: string;
}

export interface DashboardData {
  stats: DashboardStats;
  today_schedule: TodaySchedule[];
  upcoming_sessions: UpcomingSession[];
  recent_grades: RecentGrade[];
  my_courses: MyCourse[];
  recent_resources: RecentResource[];
  pending_tasks: PendingTask[];
}

export const studentDashboardApi = {
  getStats: async (): Promise<DashboardData> => {
    const response = await apiClient.get('/student/dashboard/stats');
    return response.data;
  },
};