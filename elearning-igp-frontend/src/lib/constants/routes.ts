export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_2FA: '/verify-2fa',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Admin Routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  
  // Professor Routes
  PROFESSOR_LOGIN: '/login',
  PROFESSOR_DASHBOARD: '/professor/dashboard',
  PROFESSOR_COURSES: '/professor/courses',
  
  // Student Routes
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_COURSES: '/student/courses',
  
  // Assistant Routes
  ASSISTANT_DASHBOARD: '/assistant/dashboard',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];