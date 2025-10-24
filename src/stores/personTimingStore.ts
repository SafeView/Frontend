// 🧠 사람 등장 구간 분석 상태 저장 및 액션 관리 스토어
// - zustand 기반
// - 분석 결과 및 에러 상태 관리

import { create } from 'zustand';
import { analyzePersonTiming } from '../services/personTimingService';
import type { PersonTimingResponse } from '../types/personTiming';

interface PersonTimingState {
    timings: string[];                   // 사람이 나온 구간들
    total: number;                       // 총 세그먼트 수
    loading: boolean;                   // 로딩 상태
    error: string | null;               // 에러 메시지

    analyze: (file: File) => Promise<void>; // 분석 실행
    clear: () => void;                  // 결과 및 에러 초기화
}

const usePersonTimingStore = create<PersonTimingState>((set) => ({
    timings: [],
    total: 0,
    loading: false,
    error: null,

    // ✅ 분석 실행
    analyze: async (file: File) => {
        set({ loading: true, error: null, timings: [], total: 0 });

        try {
            const res: PersonTimingResponse = await analyzePersonTiming(file);
            set({ timings: res.person_timings, total: res.total_segments });
        } catch (err: any) {
            set({ error: err.message || '분석 중 오류가 발생했습니다.' });
        } finally {
            set({ loading: false });
        }
    },

    // ✅ 상태 초기화
    clear: () => set({ timings: [], total: 0, error: null }),
}));

export default usePersonTimingStore;
