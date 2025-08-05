// services/authService.ts
import api from "../apis/api.ts";
import {
  type LoginRequest,
  type LoginResponse,
  type UserInfo,
} from "../types/user.ts";
import type { ApiResponse } from '../types/common'; // 공통 타입 불러오기


/**
 * 🔐 로그인 API
 * - 성공 시: email, name 반환
 * - 실패 시: 에러 메시지 발생
 * - JWT는 HttpOnly 쿠키로 저장되므로 token은 응답에 포함되지 않음
 */
export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', loginData);

    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '로그인에 실패했습니다.');
    }
  } catch (error: any) {
    // 서버 응답이 있는 경우
    if (error.response?.data) {
      throw new Error(error.response.data.message || '로그인 요청에 실패했습니다.');
    }
    // 네트워크 오류
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};


/**
 * 🔍 로그인된 유저 정보 가져오기
 * - 성공 시: UserInfo 반환
 * - 실패 시: 에러 메시지 발생
 *  추후 백엔드에 추가해야함
 */
export const getUserInfo = async (): Promise<UserInfo> => {
  const res = await api.get<ApiResponse<UserInfo>>('/auth/me'); // 예: /api/auth/me

  if (res.data.isSuccess) {
    return res.data.data;
  } else {
    throw new Error(res.data.message || '사용자 정보를 불러오지 못했습니다.');
  }
};
