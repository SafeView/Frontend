// src/stores/keyStore.ts
// 🔐 복호화 키 발급 및 검증 관련 상태를 zustand로 관리하는 스토어입니다.
// - 발급된 키 정보
// - 검증 결과
// - 로딩 상태 및 에러 처리 등을 포함합니다.

import { create } from 'zustand';
import { issueKey, verifyKey } from '../services/keyService';
import type { KeyIssueData, KeyVerifyBody, KeyVerifyData } from '../types/key';

// 📦 키 관련 상태 정의
interface KeyState {
    keyInfo: KeyIssueData | null;         // ✅ 발급받은 복호화 키 정보
    verifyResult: KeyVerifyData | null;   // ✅ 키 검증 결과 (유효 여부, 복호화 권한 포함)
    loading: boolean;                     // ✅ API 호출 중 로딩 상태
    error: string | null;                 // ✅ 오류 메시지

    fetchKey: () => Promise<void>;                        // 🔑 키 발급 요청
    verifyKey: (body: KeyVerifyBody) => Promise<void>;    // 🔍 키 검증 요청
    clearError: () => void;                               // ❌ 에러 초기화
    clearVerifyResult: () => void;                        // 🧼 검증 결과 초기화
}

// 🧠 zustand 스토어 생성
const useKeyStore = create<KeyState>((set) => ({
    keyInfo: null,
    verifyResult: null,
    loading: false,
    error: null,

    /**
     * 🔑 복호화 키를 서버로부터 발급받습니다.
     * - 기존 키가 유효하지 않거나 없을 경우 새로 발급
     */
    fetchKey: async () => {
        set({ loading: true, error: null });
        try {
            const data = await issueKey(); // 📡 API 호출
            set({ keyInfo: data, loading: false }); // 🟢 상태 저장
        } catch (err: any) {
            set({
                error: err.message || '키 발급 중 오류가 발생했습니다.',
                loading: false,
            });
        }
    },

    /**
     * 🧪 복호화 키를 검증합니다.
     * @param body accessToken: 사용자가 입력한 키
     *             cameraId: 복호화 대상 카메라 ID
     */
    verifyKey: async (body: KeyVerifyBody) => {
        set({ loading: true, error: null });
        try {
            const data = await verifyKey(body); // 📡 API 호출
            set({ verifyResult: data, loading: false }); // 🟢 결과 저장
        } catch (err: any) {
            set({
                error: err.message || '키 검증 중 오류가 발생했습니다.',
                loading: false,
            });
        }
    },

    /**
     * ❌ 에러 상태를 초기화합니다.
     */
    clearError: () => set({ error: null }),

    /**
     * 🧼 키 검증 결과를 초기화합니다.
     */
    clearVerifyResult: () => set({ verifyResult: null }),
}));

export default useKeyStore;
