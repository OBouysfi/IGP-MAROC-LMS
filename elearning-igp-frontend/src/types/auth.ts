export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  roles: Role[];
  permissions: Permission[];
}

export interface Role {
  id: number;
  name: string;
  slug: string;
}

export interface Permission {
  id: number;
  name: string;
  slug: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: 'student' | 'professor';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  requires_2fa?: boolean;
  email?: string;
}

export interface VerifyTwoFactorRequest {
  email: string;
  code: string;
}

export interface VerifyTwoFactorResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  role: 'student' | 'professor';
}