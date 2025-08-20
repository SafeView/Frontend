// services/userService.ts
import api from '../apis/api.ts';
import {
    type SignupRequest,
    type SignupResponse,
    type EmailCheckResponse,
} from '../types/user.ts';
import type { ApiResponse } from '../types/common'; // 공통 API 응답 타입

/**
 * 📝 회원가입 API
 *
 * 사용자가 입력한 회원 정보를 서버로 전송하여 계정을 생성합니다.
 * - 전송 데이터: 이메일, 비밀번호, 이름 등
 * - 서버는 중복 확인, 비밀번호 조건 검증 등을 수행합니다.
 *
 * @param userData 회원가입 요청 정보 (SignupRequest)
 * @returns 회원가입 성공 시 사용자 정보 (SignupResponse)
 * @throws Error - 실패 시 서버 메시지 기반 예외 발생
 */
export const signup = async (userData: SignupRequest): Promise<SignupResponse> => {
    try {
        // POST /users/signup - 회원가입 요청
        const response = await api.post<ApiResponse<SignupResponse>>('/users/signup', userData);

        // 성공 응답인 경우 → 사용자 정보 반환
        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            // 실패 응답인 경우 → 서버 메시지를 포함하여 에러 발생
            throw new Error(response.data.message || '회원가입에 실패했습니다.');
        }
    } catch (error: any) {
        // 400 등의 오류 응답이 있는 경우
        if (error.response?.data) {
            throw new Error(error.response.data.message || '회원가입 요청 중 오류가 발생했습니다.');
        }

        // 네트워크 오류 (서버와의 연결 실패 등)
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};

/**
 * 📧 이메일 중복 확인 API
 *
 * - 입력한 이메일이 이미 등록된 이메일인지 확인합니다.
 * - 사용 가능하면 available: true 를 반환
 * - 사용 불가능하면 isSuccess: false와 메시지가 포함된 예외 발생
 *
 * @param email 중복 체크할 이메일 주소
 * @returns EmailCheckResponse - { available: boolean }
 * @throws Error - 사용 불가 또는 요청 실패 시 예외 발생
 */
export const checkEmail = async (email: string): Promise<EmailCheckResponse> => {
    try {
        // GET /users/check-email?email=xxx
        const response = await api.get<ApiResponse<EmailCheckResponse>>(
            `/users/check-email?email=${encodeURIComponent(email)}`
        );

        if (response.data.isSuccess) {
            return response.data.data; // { available: true }
        } else {
            throw new Error(response.data.message || '이메일 중복 확인에 실패했습니다.');
        }
    } catch (error: any) {
        // 서버 응답 에러 메시지 우선 처리
        if (error.response?.data) {
            throw new Error(error.response.data.message || '이메일 중복 요청 실패');
        }

        throw new Error('네트워크 오류가 발생했습니다.');
    }
};
