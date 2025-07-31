import { API } from './axios';
import type { SignupRequest, SignupResponse, LoginRequest, LoginResponse, ApiResponse, EmailCheckResponse } from '../types/user';

// 회원가입 API
export const signup = async (userData: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await API.post<ApiResponse<SignupResponse>>('/users/signup', userData);
    
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || '회원가입에 실패했습니다.');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};



// 이메일 중복 체크 API
export const checkEmailDuplication = async (email: string): Promise<boolean> => {
  try {
    const response = await API.get<ApiResponse<EmailCheckResponse>>(`/users/check-email?email=${encodeURIComponent(email)}`);
    
    if (response.data.isSuccess) {
      return response.data.data.available;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || '이메일 중복 체크에 실패했습니다.');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
};

// 사용자 정보 조회 API
export const getUserInfo = async (): Promise<any> => {
  try {
    const response = await API.get('/users/me');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || '사용자 정보 조회에 실패했습니다.');
    }
    throw new Error('네트워크 오류가 발생했습니다.');
  }
}; 