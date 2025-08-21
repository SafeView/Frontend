// 🛡️ 어드민 권한 관련 API 호출 함수 모음
// 관리자(Admin)가 유저의 승격 요청을 승인하거나 거절하고,
// 전체 요청 목록을 조회할 수 있도록 구성된 API 유틸입니다.

import api from '../apis/api';
import type {
    AdminRequest,
    AdminRequestListResponse,
    AdminRequestDetailResponse,
    AdminDecisionBody,
    AdminDecisionResponse,
} from '../types/admin';

/**
 * ✅ 전체 어드민 요청 목록 조회
 *
 * @returns AdminRequest[] - 모든 권한 요청 리스트
 * @throws Error - 서버 또는 네트워크 오류 발생 시 예외 발생
 */
export const getAdminRequests = async (): Promise<AdminRequest[]> => {
    try {
        const response = await api.get<AdminRequestListResponse>('/admin/requests');

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '어드민 요청 목록 조회에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '어드민 요청 목록 조회 중 오류가 발생했습니다.');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};

/**
 * ✅ 특정 어드민 요청 상세 조회
 *
 * @param requestId - 요청 ID
 * @returns AdminRequest - 해당 요청의 상세 정보
 * @throws Error - API 요청 실패 시 예외 발생
 */
export const getAdminRequestById = async (
    requestId: number
): Promise<AdminRequest> => {
    try {
        const response = await api.get<AdminRequestDetailResponse>(`/admin/requests/${requestId}`);

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '어드민 요청 상세 조회에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '어드민 요청 상세 조회 중 오류가 발생했습니다.');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};

/**
 * ✅ 어드민 요청 승인
 *
 * @param requestId - 승인할 요청 ID
 * @param adminComment - 관리자 승인 코멘트
 * @returns AdminRequest - 승인된 요청 정보
 * @throws Error - 서버 오류 혹은 네트워크 문제 발생 시 예외 발생
 */
export const approveAdminRequest = async (
    requestId: number,
    adminComment: string
): Promise<AdminRequest> => {
    try {
        const body: AdminDecisionBody = { adminComment };

        const response = await api.put<AdminDecisionResponse>(
            `/admin/requests/${requestId}/approve`,
            body
        );

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '어드민 요청 승인에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '어드민 요청 승인 중 오류가 발생했습니다.');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};

/**
 * ✅ 어드민 요청 거절
 *
 * @param requestId - 거절할 요청 ID
 * @param adminComment - 관리자 거절 사유
 * @returns AdminRequest - 거절된 요청 정보
 * @throws Error - 요청 실패 또는 서버 오류 시 예외 발생
 */
export const rejectAdminRequest = async (
    requestId: number,
    adminComment: string
): Promise<AdminRequest> => {
    try {
        const body: AdminDecisionBody = { adminComment };

        const response = await api.put<AdminDecisionResponse>(
            `/admin/requests/${requestId}/reject`,
            body
        );

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '어드민 요청 거절에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '어드민 요청 거절 중 오류가 발생했습니다.');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};

/**
 * ✅ 대기중인 어드민 요청 목록 조회
 *
 * @returns AdminRequest[] - 상태가 PENDING인 요청 목록
 * @throws Error - 요청 실패 또는 네트워크 오류 시 예외 발생
 */
export const getPendingAdminRequests = async (): Promise<AdminRequest[]> => {
    try {
        const response = await api.get<AdminRequestListResponse>('/admin/requests/pending');

        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '대기중인 어드민 요청 목록 조회에 실패했습니다.');
        }
    } catch (error: any) {
        if (error.response?.data) {
            throw new Error(error.response.data.message || '대기중인 어드민 요청 목록 조회 중 오류가 발생했습니다.');
        }
        throw new Error('네트워크 오류가 발생했습니다.');
    }
};
