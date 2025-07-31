import { API } from './axios';
import type { LoginRequest, LoginResponse, ApiResponse } from '../types/user';

// 로그인 API
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await API.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || '로그인에 실패했습니다.');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};

// 로그아웃 API
export const logout = async (): Promise<void> => {
  try {
    await API.post('/auth/logout');
  } catch (error: any) {
    console.error('로그아웃 API 호출 실패:', error);
    // 로그아웃은 실패해도 클라이언트에서 처리하므로 에러를 던지지 않음
  }
};

// 토큰 갱신 API
export const refreshToken = async (token: string): Promise<{ token: string }> => {
  try {
    const response = await API.post<ApiResponse<{ token: string }>>('/auth/refresh', {
      token
    });
    
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || '토큰 갱신에 실패했습니다.');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};

// 사용자 정보 조회 API
export const getCurrentUser = async (): Promise<any> => {
  try {
    const response = await API.get<ApiResponse<any>>('/auth/me');
    
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || '사용자 정보 조회에 실패했습니다.');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};
