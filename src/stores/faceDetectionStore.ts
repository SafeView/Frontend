// src/stores/faceDetectionStore.ts
import { create } from 'zustand';
import type { FaceImage } from '../types/faceDetection.ts';
import { detectFacesAtTime } from '../services/faceDetectionService';

interface FaceDetectionState {
    faces: FaceImage[];
    loading: boolean;
    error: string | null;

    detect: (videoUrl: string, timeInput: string) => Promise<void>;
    clear: () => void;
}

const useFaceDetectionStore = create<FaceDetectionState>((set) => ({
    faces: [],
    loading: false,
    error: null,

    detect: async (videoUrl, timeInput) => {
        set({ loading: true, error: null });
        try {
            const result = await detectFacesAtTime(videoUrl, timeInput);
            set({ faces: result.faces, loading: false });
        } catch (e: any) {
            set({ error: e.message || '얼굴 추출 실패', loading: false });
        }
    },

    clear: () => set({ faces: [], error: null }),
}));

export default useFaceDetectionStore;
