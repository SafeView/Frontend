// src/apis/adminRequestAPI.ts
// MODERATOR(중간 관리자) 권한 요청 관련 API 호출 함수 모음입니다.
// 각 함수는 강력한 예외처리와 상세한 주석을 포함합니다.

import api from '../apis/api';
import type {
    CreateAdminRequestBody,
    CreateAdminRequestResponse,
    AdminRequestListResponse,
    AdminRequestDetailResponse,
    PendingAdminRequestCountResponse,
    AdminRequestSummary,
    AdminRequestDetail,
} from '../types/adminrequest';

/**
 * ✅ MODERATOR 권한 요청을 생성합니다.
 *
 * @param body - 요청 본문 (title: 제목, description: 설명)
 * @returns 생성된 요청의 상세 정보 객체
 * @throws Error - API 요청 실패 또는 네트워크 오류 시 에러 메시지 반환
 */
export const createAdminRequest = async (
    body: CreateAdminRequestBody
): Promise<AdminRequestDetail> => {
    try {
        const response = await api.post<CreateAdminRequestResponse>('/admin-requests', body);

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            // API 응답 실패 (isSuccess: false)
            throw new Error(response.data.message || '권한 요청 생성에 실패했습니다.');
        }
    } catch (error: any) {
        // 서버로부터 구체적인 오류 메시지가 온 경우
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }

        // 그 외 네트워크 오류 등
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};

/**
 * ✅ 로그인한 유저의 권한 요청 목록을 조회합니다.
 *
 * @returns AdminRequestSummary[] - 사용자의 권한 요청 목록 배열
 * @throws Error - 요청 실패 또는 네트워크 오류 시 예외 발생
 */
export const getMyAdminRequests = async (): Promise<AdminRequestSummary[]> => {
    try {
        const response = await api.get<AdminRequestListResponse>('/admin-requests');

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '내 권한 요청 목록 조회에 실패했습니다.');
        }
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
            '내 권한 요청 목록 조회 중 오류가 발생했습니다.'
        );
    }
};

/**
 * ✅ 특정 권한 요청의 상세 정보를 조회합니다.
 *
 * @param requestId - 조회할 요청 ID
 * @returns AdminRequestDetail - 요청의 상세 정보
 * @throws Error - 요청 실패 또는 네트워크 오류 시 예외 발생
 */
export const getMyAdminRequestDetail = async (
    requestId: number
): Promise<AdminRequestDetail> => {
    try {
        const response = await api.get<AdminRequestDetailResponse>(`/admin-requests/${requestId}`);

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '내 권한 요청 상세 조회에 실패했습니다.');
        }
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
            '내 권한 요청 상세 조회 중 오류가 발생했습니다.'
        );
    }
};

/**
 * ✅ 대기중인 MODERATOR 권한 요청 수를 조회합니다.
 *
 * @returns number - 승인 대기 중인 요청의 총 개수
 * @throws Error - 요청 실패 또는 네트워크 오류 시 예외 발생
 */
export const getPendingAdminRequestCount = async (): Promise<number> => {
    try {
        const response = await api.get<PendingAdminRequestCountResponse>(
            '/admin-requests/pending/count'
        );

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '대기중 요청 개수 조회에 실패했습니다.');
        }
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
            '대기중 요청 개수 조회 중 오류가 발생했습니다.'
        );
    }
};
