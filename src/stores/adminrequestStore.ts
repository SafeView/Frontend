// 🔐 MODERATOR(중간 관리자) 권한 요청 상태를 zustand로 관리하는 스토어입니다.
// 요청 목록, 상세, 대기 요청 수, 생성 요청 처리 등 모든 상태를 캡슐화합니다.

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

// ✅ 상태 정의 인터페이스
interface AdminRequestState {
    requests: AdminRequestSummary[];                // 내 요청 목록
    selectedRequest: AdminRequestDetail | null;     // 선택된 요청 상세 정보
    pendingCount: number;                           // 대기 중인 권한 요청 수
    loading: boolean;                               // 로딩 상태
    error: string | null;                           // 에러 메시지

    fetchRequests: () => Promise<void>;                             // 목록 조회
    fetchRequestDetail: (requestId: number) => Promise<void>;       // 상세 조회
    fetchPendingCount: () => Promise<void>;                         // 대기 개수 조회
    createRequest: (body: CreateAdminRequestBody) => Promise<void>; // 요청 생성
    clearError: () => void;                                         // 에러 초기화
    clearSelected: () => void;                                      // 선택 초기화
}

// ✅ zustand 스토어 생성
const useAdminRequestStore = create<AdminRequestState>((set) => ({
    requests: [],
    selectedRequest: null,
    pendingCount: 0,
    loading: false,
    error: null,

    /**
     * 🔄 내 MODERATOR 권한 요청 목록을 불러옵니다.
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
     * 🔍 요청 ID 기반으로 MODERATOR 권한 요청 상세 정보를 불러옵니다.
     * @param requestId - 선택된 요청 ID
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
     * 📊 현재 대기 중인 MODERATOR 권한 요청 개수를 불러옵니다.
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
     * ➕ 새로운 MODERATOR 권한 요청을 생성합니다.
     * @param body - 요청 제목, 설명 등 정보 포함
     */
    createRequest: async (body: CreateAdminRequestBody) => {
        set({ loading: true, error: null });
        try {
            await createAdminRequest(body);
            set({ loading: false });
        } catch (err: any) {
            // ✅ 여기 수정
            const errorMsg =
                err?.message || // Error 객체의 message 사용
                err?.response?.data?.data || // 백엔드 data 필드
                '권한 요청 생성 중 오류가 발생했습니다.';

            set({
                error: errorMsg,
                loading: false,
            });
        }
    },

    /**
     * ❌ 에러 상태를 초기화합니다.
     */
    clearError: () => set({ error: null }),

    /**
     * 🔄 선택된 요청 상세 정보를 초기화합니다.
     */
    clearSelected: () => set({ selectedRequest: null }),
}));

export default useAdminRequestStore;
