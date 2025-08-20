// src/stores/faceDetectionStore.ts
import { create } from 'zustand';
import type { FaceImage } from '../types/faceDetection.ts';
import { detectFacesAtTime, detectFacesFromFile } from '../services/faceDetectionService';

interface FaceDetectionState {
    faces: FaceImage[];
    loading: boolean;
    error: string | null;

    detect: (videoUrl: string, timeInput: string) => Promise<void>;
    detectFromFile: (file: File, timeInput: string) => Promise<void>;
    clear: () => void;
}

const useFaceDetectionStore = create<FaceDetectionState>((set) => ({
    faces: [],
    loading: false,
    error: null,

    detect: async (videoUrl, timeInput) => {
        set({ loading: true, error: null });
        try {
            // blob: URL은 서버에서 접근 불가 → 업로드 후 받은 http(s) URL만 전달해야 함
            if (videoUrl.startsWith('blob:')) {
                throw new Error('blob URL은 전송할 수 없습니다. 파일을 먼저 업로드하세요.');
            }

            const isLikelyS3 = videoUrl.startsWith('http://') || videoUrl.startsWith('https://');
            const result = await detectFacesAtTime(videoUrl, timeInput, isLikelyS3);
            set({ faces: result.faces, loading: false });
        } catch (e: any) {
            set({ error: e.message || '얼굴 추출 실패', loading: false });
        }
    },

    detectFromFile: async (file, timeInput) => {
        set({ loading: true, error: null });
        try {
            const result = await detectFacesFromFile(file, timeInput);
            set({ faces: result.faces, loading: false });
        } catch (e: any) {
            set({ error: e.message || '얼굴 추출 실패', loading: false });
        }
    },

    clear: () => set({ faces: [], error: null }),
}));

export default useFaceDetectionStore;
