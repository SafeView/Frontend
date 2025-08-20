// services/authService.ts
import api from "../apis/api.ts";
import {
    type LoginRequest,
    type LoginResponse,
    type UserInfo,
} from "../types/user.ts";
import type { ApiResponse } from '../types/common'; // 공통 API 응답 타입

/**
 * 🔐 로그인 API
 * - 사용자 이메일 및 비밀번호를 서버에 전송하여 인증 요청
 * - 성공 시: 사용자 정보(email, name 등)를 응답으로 받음
 * - 실패 시: 에러 메시지 반환
 * - JWT는 HttpOnly 쿠키로 저장되므로 클라이언트에서는 직접 접근할 수 없음
 */
export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', loginData);

        if (response.data.isSuccess) {
            return response.data.data; // 로그인 성공 → 사용자 정보 반환
        } else {
            throw new Error(response.data.message || '로그인에 실패했습니다.');
        }
    } catch (error: any) {
        // ❗ 서버에서 에러 응답이 왔을 경우
        if (error.response?.data) {
            throw new Error(error.response.data.message || '로그인 요청에 실패했습니다.');
        }
        // ❗ 네트워크 오류 또는 기타 에러
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};


/**
 * 🔍 현재 로그인된 사용자 정보 조회
 * - 서버 세션 또는 쿠키에 저장된 인증 정보를 기반으로 사용자 정보 반환
 * - 실패 시 예외 발생
 * - ⚠️ 해당 API는 백엔드에서 '/auth/me' 등의 라우트로 구현되어 있어야 함
 */
export const getUserInfo = async (): Promise<UserInfo> => {
    const res = await api.get<ApiResponse<UserInfo>>('/auth/me'); // 사용자 정보 조회 API 호출

    if (res.data.isSuccess) {
        return res.data.data; // 사용자 정보 반환
    } else {
        throw new Error(res.data.message || '사용자 정보를 불러오지 못했습니다.');
    }
};


/**
 * 🚪 로그아웃 처리
 * - 서버에 로그아웃 요청 전송하여 인증 정보 초기화
 * - 서버 측 세션/쿠키 제거
 * - 별도의 응답 데이터는 없지만 성공 여부는 isSuccess로 판단
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
 * 🔄 액세스 토큰 재발급 요청
 * - Access Token이 만료된 경우, 서버에 Refresh Token을 통해 새 토큰 요청
 * - 보통은 Refresh Token이 쿠키에 저장되어 자동으로 전송됨
 * - 성공 시: 토큰 재발급 성공 메시지 반환
 * - 실패 시: 예외 발생
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
