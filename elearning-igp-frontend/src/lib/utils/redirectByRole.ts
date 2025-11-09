
import { ROUTES } from '@/lib/constants/routes';

export const redirectByRole = (role: string): string => {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN_DASHBOARD;
    case 'professor':
      return ROUTES.PROFESSOR_DASHBOARD;
    case 'student':
      return ROUTES.STUDENT_DASHBOARD;
    default:
      return ROUTES.HOME;
  }
};