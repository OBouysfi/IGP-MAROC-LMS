export const ROLES = {
  ADMIN: 'admin',
  PROFESSOR: 'professor',
  STUDENT: 'student',
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];