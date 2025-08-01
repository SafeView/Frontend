export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
  gender: string;
  birthday: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  name: string;
  address: string;
  phone: string;
  gender: string;
  birthday: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  name: string;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 공통 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}

// 이메일 중복 체크 응답 타입
export interface EmailCheckResponse {
  available: boolean;
} 