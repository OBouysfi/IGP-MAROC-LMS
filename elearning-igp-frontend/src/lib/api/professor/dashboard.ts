import axiosInstance from '../axios';

export interface DashboardStats {
  total_courses: number;
  total_students: number;
  pending_grades: number;
  upcoming_sessions: number;
  hours_this_month: number;
  average_attendance: number;
}

export interface TodaySchedule {
  id: number;
  course: string;
  group: string;
  time: string;
  room: string;
  type: string;
}

export interface UpcomingSession {
  id: number;
  course: string;
  date: string;
  time: string;
  topic: string;
  students_registered: number;
}

export interface PendingTask {
  id: number;
  task: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RecentActivity {
  id: number;
  action: string;
  course: string;
  time: string;
}

export interface MyCourse {
  id: number;
  name: string;
  code: string;
  students: number;
  progress: number;
  next_class: string;
}

export interface DashboardData {
  stats: DashboardStats;
  today_schedule: TodaySchedule[];
  upcoming_sessions: UpcomingSession[];
  pending_tasks: PendingTask[];
  recent_activity: RecentActivity[];
  my_courses: MyCourse[];
}

export const professorDashboardApi = {
  getDashboard: () => 
    axiosInstance.get<{ data: DashboardData }>('/professor/dashboard'),
};