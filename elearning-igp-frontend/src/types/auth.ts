export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  email_verified_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  redirect?: string;
}

export interface LoginResponse {
  message: string;
  email: string;
  requires_2fa: boolean;
  user?: User;
  token?: string;
}

export interface VerifyTwoFactorRequest {
  email: string;
  code: string;
}

export interface VerifyTwoFactorResponse {
  message: string;
  token: string;
  user: User;
  requires_2fa: boolean;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}