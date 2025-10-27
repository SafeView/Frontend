// 🧠 사진 + 비디오 기반 특정 인물 등장 구간 분석 스토어
// - zustand 기반
// - 분석 결과, 임계값, 에러 상태 관리

import { create } from 'zustand';
import { analyzeFaceRecognitionTiming } from '../services/personTimingService';
import type { PersonTimingResponse } from '../types/personTiming';

interface FaceRecognitionTimingState {
    timings: string[];                        // 인물 등장 시간 구간
    total: number;                            // 총 세그먼트 수
    threshold: number | null;                // 유사도 임계값
    loading: boolean;                         // 로딩 상태
    error: string | null;                     // 에러 메시지

    analyze: (image: File, video: File) => Promise<void>; // 분석 실행
    clear: () => void;                        // 결과 및 에러 초기화
}

const useFaceRecognitionTimingStore = create<FaceRecognitionTimingState>((set) => ({
    timings: [],
    total: 0,
    threshold: null,
    loading: false,
    error: null,

    // ✅ 분석 실행 함수
    analyze: async (imageFile: File, videoFile: File) => {
        set({ loading: true, error: null, timings: [], total: 0, threshold: null });

        try {
            const res: PersonTimingResponse = await analyzeFaceRecognitionTiming(imageFile, videoFile);
            set({
                timings: res.person_timings,
                total: res.total_segments,
                threshold: res.similarity_threshold ?? null
            });
        } catch (err: any) {
            set({ error: err.message || '인물 분석 중 오류가 발생했습니다.' });
        } finally {
            set({ loading: false });
        }
    },

    // ✅ 상태 초기화 함수
    clear: () => set({ timings: [], total: 0, threshold: null, error: null }),
}));

export default useFaceRecognitionTimingStore;
