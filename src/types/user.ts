export type Gender = 'MALE' | 'FEMALE'; // ← 백엔드 Enum 이름 기준

// 회원가입 요청 타입
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
  gender: Gender; // 'MALE' | 'FEMALE'
  birthday: string;
}

// 회원가입 응답 타입 (백엔드 기준: id, email, name만 전달됨)
export interface SignupResponse {
  id: number;
  email: string;
  name: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입 (쿠키 기반이므로 token 없음)
export interface LoginResponse {
  email: string;
  name: string;
}

// 이메일 중복 체크 응답
export interface EmailCheckResponse {
  available: boolean;
}

// 유저 정보 타입 (ex: /api/auth/me)
export interface UserInfo {
  id: number;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  gender?: Gender;
  birthday?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// 공통 응답 타입 (제네릭으로 감싸는 wrapper)
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}
