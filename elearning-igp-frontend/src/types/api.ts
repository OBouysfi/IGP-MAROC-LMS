export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}