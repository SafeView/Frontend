// src/stores/faceDetectionStore.ts
// 🎯 얼굴 탐지 결과 및 상태를 관리하는 zustand 스토어
// 시간 기반 얼굴 추출 API 또는 파일 기반 추출 API를 호출하고 상태를 저장합니다.

import { create } from 'zustand';
import type { FaceImage } from '../types/faceDetection.ts';
import { detectFacesAtTime, detectFacesFromFile } from '../services/faceDetectionService';

// 🧠 얼굴 탐지 상태 타입 정의
interface FaceDetectionState {
    faces: FaceImage[];                      // ✅ 추출된 얼굴 이미지 목록
    loading: boolean;                        // ✅ API 요청 중 로딩 상태
    error: string | null;                    // ✅ 오류 메시지

    detect: (videoUrl: string, timeInput: string) => Promise<void>;       // URL 기반 얼굴 추출
    detectFromFile: (file: File, timeInput: string) => Promise<void>;     // 파일 업로드 기반 얼굴 추출
    clear: () => void;                                                           // 상태 초기화
}

// ✅ zustand 스토어 생성
const useFaceDetectionStore = create<FaceDetectionState>((set) => ({
    faces: [],            // 초기 상태: 얼굴 이미지 없음
    loading: false,       // 초기 로딩 상태: false
    error: null,          // 초기 에러 상태: null

    /**
     * ⏱ 특정 시간에 해당하는 영상 URL에서 얼굴을 탐지합니다.
     * @param videoUrl - 영상의 S3 URL 또는 일반 HTTP URL (blob: URL은 서버에서 인식 불가)
     * @param timeInput - 분석 대상 시간 (형식: mm:ss 또는 ss)
     */
    detect: async (videoUrl, timeInput) => {
        set({ loading: true, error: null });
        try {
            // ❌ blob URL은 서버에서 접근할 수 없으므로 예외 처리
            if (videoUrl.startsWith('blob:')) {
                throw new Error('blob URL은 전송할 수 없습니다. 파일을 먼저 업로드하세요.');
            }

            // ✅ S3 또는 일반 URL로 전달 가능한지 확인
            const isLikelyS3 = videoUrl.startsWith('http://') || videoUrl.startsWith('https://');
            const result = await detectFacesAtTime(videoUrl, timeInput, isLikelyS3);

            // ✅ 결과 상태 업데이트
            set({ faces: result.faces, loading: false });
        } catch (e: any) {
            // ❌ 오류 처리
            set({ error: e.message || '얼굴 추출 실패', loading: false });
        }
    },

    /**
     * 📁 업로드된 비디오 파일을 기반으로 특정 시간의 얼굴을 추출합니다.
     * @param file - 업로드할 비디오 파일 객체
     * @param timeInput - 분석할 시간 (예: "01:12")
     */
    detectFromFile: async (file, timeInput) => {
        set({ loading: true, error: null });
        try {
            const result = await detectFacesFromFile(file, timeInput);
            set({ faces: result.faces, loading: false });
        } catch (e: any) {
            set({ error: e.message || '얼굴 추출 실패', loading: false });
        }
    },

    /**
     * 🔄 탐지 결과 및 오류 상태 초기화
     */
    clear: () => set({ faces: [], error: null }),
}));

export default useFaceDetectionStore;
