import api from '../apis/api';
import type {
  AdminRequest,
  AdminRequestListResponse,
  AdminRequestDetailResponse,
  AdminDecisionBody,
  AdminDecisionResponse,
} from '../types/admin';

/**
 * 전체 어드민 요청 목록을 조회합니다.
 * 쿠키 기반 인증을 사용하므로 별도의 Authorization 헤더가 필요 없습니다.
 * @returns AdminRequest[] - 어드민 요청 목록
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
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
 * 특정 어드민 요청의 상세 정보를 조회합니다.
 * @param requestId 요청 ID
 * @returns AdminRequest - 어드민 요청 상세 정보
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
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
 * 어드민 요청을 승인합니다.
 * @param requestId 요청 ID
 * @param adminComment 관리자 코멘트
 * @returns AdminRequest - 승인된 어드민 요청 정보
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const approveAdminRequest = async (
  requestId: number,
  adminComment: string
): Promise<AdminRequest> => {
  try {
    const body: AdminDecisionBody = { adminComment };
    const response = await api.post<AdminDecisionResponse>(
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
 * 어드민 요청을 거절합니다.
 * @param requestId 요청 ID
 * @param adminComment 관리자 코멘트
 * @returns AdminRequest - 거절된 어드민 요청 정보
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const rejectAdminRequest = async (
  requestId: number,
  adminComment: string
): Promise<AdminRequest> => {
  try {
    const body: AdminDecisionBody = { adminComment };
    const response = await api.post<AdminDecisionResponse>(
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
 * 대기중(PENDING)인 어드민 요청 목록을 조회합니다.
 * @returns AdminRequest[] - 대기중인 어드민 요청 목록
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
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
