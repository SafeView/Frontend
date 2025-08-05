// MODERATOR(중간 관리자) 권한 요청 관련 상태를 zustand로 관리하는 스토어입니다.
// 요청 목록, 상세, 대기중 개수, 생성 등 상태와 메서드를 제공합니다.

import { create } from 'zustand';
import {
  createAdminRequest,
  getMyAdminRequests,
  getMyAdminRequestDetail,
  getPendingAdminRequestCount,
} from '../services/adminrequestService';
import type {
  AdminRequestSummary,
  AdminRequestDetail,
  CreateAdminRequestBody,
} from '../types/adminrequest';

interface AdminRequestState {
  requests: AdminRequestSummary[];                // 내 요청 목록
  selectedRequest: AdminRequestDetail | null;     // 선택된 요청 상세
  pendingCount: number;                           // 대기중 요청 개수
  loading: boolean;                               // 로딩 상태
  error: string | null;                           // 에러 메시지

  fetchRequests: () => Promise<void>;                             // 내 요청 목록 불러오기
  fetchRequestDetail: (requestId: number) => Promise<void>;       // 내 요청 상세 불러오기
  fetchPendingCount: () => Promise<void>;                         // 대기중 요청 개수 불러오기
  createRequest: (body: CreateAdminRequestBody) => Promise<void>; // 요청 생성
  clearError: () => void;                                         // 에러 초기화
  clearSelected: () => void;                                      // 선택 초기화
}

const useAdminRequestStore = create<AdminRequestState>((set) => ({
  requests: [],
  selectedRequest: null,
  pendingCount: 0,
  loading: false,
  error: null,

  /**
   * 내 MODERATOR 권한 요청 목록을 불러옵니다.
   */
  fetchRequests: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getMyAdminRequests();
      set({ requests: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '내 권한 요청 목록을 불러오는 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 내 MODERATOR 권한 요청 상세를 불러옵니다.
   * @param requestId 요청 ID
   */
  fetchRequestDetail: async (requestId: number) => {
    set({ loading: true, error: null });
    try {
      const data = await getMyAdminRequestDetail(requestId);
      set({ selectedRequest: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '내 권한 요청 상세 조회 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 내 대기중인 MODERATOR 권한 요청 개수를 불러옵니다.
   */
  fetchPendingCount: async () => {
    set({ loading: true, error: null });
    try {
      const count = await getPendingAdminRequestCount();
      set({ pendingCount: count, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '대기중 요청 개수 조회 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * MODERATOR 권한 요청을 생성합니다.
   * @param body 요청 바디 (title, description)
   */
  createRequest: async (body: CreateAdminRequestBody) => {
    set({ loading: true, error: null });
    try {
      await createAdminRequest(body);
      set({ loading: false });
    } catch (err: any) {
      set({
        error: err.message || '권한 요청 생성 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 에러 상태를 초기화합니다.
   */
  clearError: () => set({ error: null }),

  /**
   * 선택된 요청 상태를 초기화합니다.
   */
  clearSelected: () => set({ selectedRequest: null }),
}));

export default useAdminRequestStore;

