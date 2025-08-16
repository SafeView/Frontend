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



/**
 * 🚪 로그아웃 API
 * - 서버에 요청하여 세션/쿠키를 제거
 * - 성공 시 별도의 응답 데이터 없음
 */
export const logout = async (): Promise<void> => {
    try {
        const response = await api.post<ApiResponse<null>>('/auth/logout');

        if (!response.data.isSuccess) {
            throw new Error(response.data.message || '로그아웃에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '로그아웃 요청 중 오류가 발생했습니다.');
        }
        throw new Error('네트워크 오류로 로그아웃에 실패했습니다.');
    }
};

/**
 * 🔄 토큰 재발급 API
 * - Access Token이 만료된 경우, 서버에서 새로 발급
 * - 성공 시: 메시지 응답
 * - 실패 시: 에러 메시지 발생
 */
export const refreshToken = async (): Promise<string> => {
    try {
        const response = await api.post<ApiResponse<string>>('/auth/refresh');

        if (response.data.isSuccess) {
            return response.data.data; // "Access Token이 재발급되었습니다." 등의 메시지
        } else {
            throw new Error(response.data.message || '토큰 재발급에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '토큰 재발급 요청 중 오류가 발생했습니다.');
        }
        throw new Error('네트워크 오류로 토큰 재발급에 실패했습니다.');
    }
};
