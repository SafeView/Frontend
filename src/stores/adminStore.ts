import { create } from 'zustand';
import {
  getAdminRequests,
  getPendingAdminRequests,
  getAdminRequestById,
  approveAdminRequest,
  rejectAdminRequest,
} from '../services/adminService';
import type { AdminRequest } from '../types/admin';

interface AdminState {
  requests: AdminRequest[];
  pendingRequests: AdminRequest[]; // 대기중 요청 목록
  selectedRequest: AdminRequest | null;
  loading: boolean;
  error: string | null;

  fetchRequests: () => Promise<void>;
  fetchPendingRequests: () => Promise<void>; // 대기중 요청 목록 불러오기
  fetchRequestById: (requestId: number) => Promise<void>;
  approveRequest: (requestId: number, adminComment: string) => Promise<void>;
  rejectRequest: (requestId: number, adminComment: string) => Promise<void>;
  clearError: () => void;
  clearSelected: () => void;
}

const useAdminStore = create<AdminState>((set) => ({
  requests: [],
  pendingRequests: [],
  selectedRequest: null,
  loading: false,
  error: null,

  /**
   * 전체 어드민 요청 목록을 불러옵니다.
   */
  fetchRequests: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAdminRequests();
      set({ requests: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '어드민 요청 목록을 불러오는 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 대기중(PENDING)인 어드민 요청 목록을 불러옵니다.
   */
  fetchPendingRequests: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getPendingAdminRequests();
      set({ pendingRequests: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '대기중인 어드민 요청 목록을 불러오는 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 특정 어드민 요청 상세 정보를 불러옵니다.
   * @param requestId 요청 ID
   */
  fetchRequestById: async (requestId: number) => {
    set({ loading: true, error: null });
    try {
      const data = await getAdminRequestById(requestId);
      set({ selectedRequest: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '어드민 요청 상세 조회 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 어드민 요청을 승인합니다.
   * @param requestId 요청 ID
   * @param adminComment 관리자 코멘트
   */
  approveRequest: async (requestId: number, adminComment: string) => {
    set({ loading: true, error: null });
    try {
      const updated = await approveAdminRequest(requestId, adminComment);
      set((state) => ({
        selectedRequest: updated,
        requests: state.requests.map((r) => (r.id === updated.id ? updated : r)),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || '어드민 요청 승인 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 어드민 요청을 거절합니다.
   * @param requestId 요청 ID
   * @param adminComment 관리자 코멘트
   */
  rejectRequest: async (requestId: number, adminComment: string) => {
    set({ loading: true, error: null });
    try {
      const updated = await rejectAdminRequest(requestId, adminComment);
      set((state) => ({
        selectedRequest: updated,
        requests: state.requests.map((r) => (r.id === updated.id ? updated : r)),
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || '어드민 요청 거절 중 오류가 발생했습니다.',
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

export default useAdminStore;
