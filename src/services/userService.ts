// services/userService.ts
import api from '../apis/api.ts';
import {
    type SignupRequest,
    type SignupResponse,
    type EmailCheckResponse,
} from '../types/user.ts';
import type { ApiResponse } from '../types/common'; // 공통 타입 불러오기


/**
 * 📝 회원가입 API
 * - 성공 시: 회원 정보 반환
 * - 실패 시: 예외 메시지 처리
 */
export const signup = async (userData: SignupRequest): Promise<SignupResponse> => {
    try {
        const response = await api.post<ApiResponse<SignupResponse>>('/users/signup', userData);

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '회원가입에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '회원가입 요청 중 오류가 발생했습니다.');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};

/**
 * 📧 이메일 중복 확인 API
 * - 사용 가능: available = true
 * - 사용 불가: 예외 발생
 */
export const checkEmail = async (email: string): Promise<EmailCheckResponse> => {
    try {
        const response = await api.get<ApiResponse<EmailCheckResponse>>(
            `/users/check-email?email=${encodeURIComponent(email)}`
        );

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '이메일 중복 확인에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '이메일 중복 요청 실패');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};
