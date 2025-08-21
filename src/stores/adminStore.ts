// 🧩 어드민(관리자) 권한 요청 관련 상태를 zustand로 관리하는 스토어입니다.
// 관리자는 사용자의 권한 요청을 승인/거절하거나 상세를 조회할 수 있습니다.

import { create } from 'zustand';
import {
    getAdminRequests,
    getPendingAdminRequests,
    getAdminRequestById,
    approveAdminRequest,
    rejectAdminRequest,
} from '../services/adminService';
import type { AdminRequest } from '../types/admin';

// ✅ 상태 정의 인터페이스
interface AdminState {
    requests: AdminRequest[];                // 전체 권한 요청 목록
    pendingRequests: AdminRequest[];         // 대기 중인 요청 목록
    selectedRequest: AdminRequest | null;    // 선택된 요청 상세
    loading: boolean;                        // 로딩 상태
    error: string | null;                    // 에러 메시지

    // 🚀 액션 메서드들
    fetchRequests: () => Promise<void>;                                  // 전체 요청 목록 조회
    fetchPendingRequests: () => Promise<void>;                           // 대기 중 요청 목록 조회
    fetchRequestById: (requestId: number) => Promise<void>;              // 단일 요청 상세 조회
    approveRequest: (requestId: number, adminComment: string) => Promise<void>; // 승인 처리
    rejectRequest: (requestId: number, adminComment: string) => Promise<void>;  // 거절 처리
    clearError: () => void;                                              // 에러 초기화
    clearSelected: () => void;                                           // 선택 초기화
}

// ✅ zustand 스토어 생성
const useAdminStore = create<AdminState>((set) => ({
    requests: [],
    pendingRequests: [],
    selectedRequest: null,
    loading: false,
    error: null,

    /**
     * 📋 모든 권한 요청 목록을 불러옵니다. (관리자 전체 요청)
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
     * ⏳ 대기(PENDING) 상태인 요청 목록만 불러옵니다.
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
     * 🔍 특정 요청의 상세 정보를 조회합니다.
     * @param requestId - 요청 ID
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
     * ✅ 요청을 승인 처리합니다.
     * @param requestId - 승인할 요청 ID
     * @param adminComment - 관리자 코멘트
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
     * ❌ 요청을 거절 처리합니다.
     * @param requestId - 거절할 요청 ID
     * @param adminComment - 관리자 코멘트
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
     * 🧹 에러 메시지를 초기화합니다.
     */
    clearError: () => set({ error: null }),

    /**
     * 🔄 선택된 요청 상태를 초기화합니다.
     */
    clearSelected: () => set({ selectedRequest: null }),
}));

export default useAdminStore;
