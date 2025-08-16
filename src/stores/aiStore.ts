import { create } from 'zustand';
import type { AutoRecordingStarted, AutoRecordingFinalized } from '../types/autorecording.ts';
import { useSnackbarStore } from './snackbarStore'; // ✅ 스낵바 store 임포트

interface AutoRecordingState {
    isRecording: boolean;
    recordingFilename: string | null;
    recordingStartedAt: string | null;
    recordingUrl: string | null;
    personsDetected: number;
    maxDetected: number | null;
    duration: number | null;
    startAutoRecording: (payload: AutoRecordingStarted) => void;
    stopAutoRecording: (payload: AutoRecordingFinalized) => void;
    reset: () => void;
}

export const useAIStore = create<AutoRecordingState>((set) => ({
    isRecording: false,
    recordingFilename: null,
    recordingStartedAt: null,
    recordingUrl: null,
    personsDetected: 0,
    maxDetected: null,
    duration: null,

    startAutoRecording: ({ filename, started_at, initial_persons }) => {
        // ✅ 스낵바 메시지 등록
        useSnackbarStore.getState().enqueueSnackbar({
            message: `🎥 자동 녹화 시작: ${filename}`,
            type: 'info',
        });

        set({
            isRecording: true,
            recordingFilename: filename,
            recordingStartedAt: started_at,
            personsDetected: initial_persons,
        });
    },

    stopAutoRecording: ({ filename, s3_url, segment_max_persons, duration_sec }) => {
        // ✅ 스낵바 메시지 등록
        useSnackbarStore.getState().enqueueSnackbar({
            message: `✅ 녹화 저장 완료: ${filename}`,
            type: 'success',
        });

        set({
            isRecording: false,
            recordingFilename: filename,
            recordingUrl: s3_url,
            maxDetected: segment_max_persons,
            duration: duration_sec,
        });
    },

    reset: () =>
        set({
            isRecording: false,
            recordingFilename: null,
            recordingStartedAt: null,
            recordingUrl: null,
            personsDetected: 0,
            maxDetected: null,
            duration: null,
        }),
}));
