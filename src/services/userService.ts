// services/userService.ts
import api from '../apis/api.ts';
import {
    type SignupRequest,
    type SignupResponse,
    type EmailCheckResponse,
    type UserInfo,
    type UpdateUserRequest,
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

/**
 * 🔍 현재 로그인된 사용자 정보 조회
 * - 서버 세션 또는 쿠키에 저장된 인증 정보를 기반으로 사용자 정보 반환
 * - 실패 시 예외 발생
 * - ⚠️ 해당 API는 백엔드에서 '/auth/me' 등의 라우트로 구현되어 있어야 함
 */
export const getUserInfo = async (): Promise<UserInfo> => {
    const res = await api.get<ApiResponse<UserInfo>>('/user/me'); // 사용자 정보 조회 API 호출

    if (res.data.isSuccess) {
        return res.data.data; // 사용자 정보 반환
    } else {
        throw new Error(res.data.message || '사용자 정보를 불러오지 못했습니다.');
    }
};


/**
 * 🛠️ 회원 정보 수정 API
 *
 * - 사용자가 자신의 프로필 정보를 수정할 수 있습니다.
 * - 수정 항목: 비밀번호, 이름, 주소, 전화번호, 성별, 생년월일
 *
 * @param updateData 수정할 유저 정보 (UpdateUserRequest)
 * @returns 수정된 사용자 정보 (UserInfo)
 * @throws Error - 실패 시 서버 메시지 기반 예외 발생
 */
export const updateUserInfo = async (updateData: UpdateUserRequest): Promise<UserInfo> => {
    try {
        const response = await api.put<ApiResponse<UserInfo>>('/users/me', updateData);

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '회원 정보 수정에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '회원 정보 수정 중 오류 발생');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};

/**
 * ✉️ 임시 비밀번호 발송 API
 *
 * - 사용자가 비밀번호를 잊었을 경우, 등록된 이메일로 임시 비밀번호를 발송합니다.
 *
 * @param email 임시 비밀번호를 받을 사용자 이메일
 * @returns 성공 메시지 문자열
 * @throws Error - 실패 시 예외 발생 (ex: 사용자 없음)
 */
export const sendTempPassword = async (email: string): Promise<string> => {
    try {
        const response = await api.post<ApiResponse<{ message: string }>>('/users/temp-password', { email });

        if (response.data.isSuccess) {
            return response.data.data.message; // ex: "임시 비밀번호가 이메일로 발송되었습니다."
        } else {
            throw new Error(response.data.message || '임시 비밀번호 발송에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '임시 비밀번호 요청 중 오류 발생');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};


/**
 * 📧 이메일 인증번호 발송 API
 *
 * - 회원가입 시 입력한 이메일 주소로 인증번호를 전송합니다.
 * - 이미 가입된 이메일인 경우 409 에러 발생
 *
 * @param email 인증번호를 받을 이메일 주소
 * @returns 성공 메시지 문자열
 * @throws Error - 이미 존재하는 이메일 또는 서버 오류 시 예외 발생
 */
export const sendEmailVerificationCode = async (email: string): Promise<string> => {
    try {
        const response = await api.post<ApiResponse<{ message: string }>>(
            '/users/email-verification/send',
            { email }
        );

        if (response.data.isSuccess) {
            return response.data.data.message; // ex: "인증번호가 이메일로 발송되었습니다."
        } else {
            throw new Error(response.data.message || '이메일 인증번호 전송에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '이메일 인증번호 전송 중 오류 발생');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};

/**
 * ✅ 이메일 인증번호 검증 API
 *
 * - 사용자가 입력한 인증번호가 서버에 등록된 값과 일치하는지 검증합니다.
 * - 만료되었거나 틀릴 경우, 400 에러와 함께 실패 메시지 반환
 *
 * @param payload 이메일과 인증번호
 * @returns 성공 메시지 문자열
 * @throws Error - 인증 실패 또는 서버 오류 시 예외 발생
 */
export const verifyEmailCode = async (payload: { email: string; code: string }): Promise<string> => {
    try {
        const response = await api.post<ApiResponse<{ message: string }>>(
            '/users/email-verification/verify',
            payload
        );

        if (response.data.isSuccess) {
            return response.data.data.message; // ex: "이메일 인증이 완료되었습니다."
        } else {
            throw new Error(response.data.message || '이메일 인증에 실패했습니다.');
        }
    } catch (error: any) {
        // ✅ data 자체에 에러 메시지가 담기는 케이스도 고려
        if (error.response?.data) {
            const fallback = typeof error.response.data.data === 'string'
                ? error.response.data.data
                : error.response.data.message;

            throw new Error(fallback || '이메일 인증 요청 중 오류 발생');
        }

        throw new Error('네트워크 오류가 발생했습니다.');
    }
};
