// 복호화 키 발급 및 검증 관련 상태를 zustand로 관리하는 스토어입니다.
// 키 정보, 검증 결과, 에러, 로딩 상태 등을 제공합니다.

import { create } from 'zustand';
import { issueKey, verifyKey } from '../services/keyService';
import type { KeyIssueData, KeyVerifyBody, KeyVerifyData } from '../types/key';

interface KeyState {
  keyInfo: KeyIssueData | null;         // 발급받은 키 정보
  verifyResult: KeyVerifyData | null;   // 키 검증 결과
  loading: boolean;                     // 로딩 상태
  error: string | null;                 // 에러 메시지

  fetchKey: () => Promise<void>;                        // 키 발급 요청
  verifyKey: (body: KeyVerifyBody) => Promise<void>;    // 키 검증 요청
  clearError: () => void;                               // 에러 초기화
  clearVerifyResult: () => void;                        // 검증 결과 초기화
}

const useKeyStore = create<KeyState>((set) => ({
  keyInfo: null,
  verifyResult: null,
  loading: false,
  error: null,

  /**
   * 복호화 키를 발급받습니다.
   */
  fetchKey: async () => {
    set({ loading: true, error: null });
    try {
      const data = await issueKey();
      set({ keyInfo: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '키 발급 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 복호화 키를 검증합니다.
   * @param body accessToken, cameraId
   */
  verifyKey: async (body: KeyVerifyBody) => {
    set({ loading: true, error: null });
    try {
      const data = await verifyKey(body);
      set({ verifyResult: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '키 검증 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 에러 상태를 초기화합니다.
   */
  clearError: () => set({ error: null }),

  /**
   * 검증 결과 상태를 초기화합니다.
   */
  clearVerifyResult: () => set({ verifyResult: null }),
}));

export default useKeyStore;
