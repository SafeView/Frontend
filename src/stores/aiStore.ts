// 🎥 AI 기반 자동 녹화 상태를 zustand로 관리하는 스토어입니다.
// 녹화 시작/종료 시점, 녹화 파일 정보, 탐지 인원 수, 녹화 길이 등을 저장합니다.

import { create } from 'zustand';
import type { AutoRecordingStarted, AutoRecordingFinalized } from '../types/autorecording.ts';
import { useSnackbarStore } from './snackbarStore'; // ✅ 스낵바 상태 관리 스토어

// 🧩 자동 녹화 상태 인터페이스 정의
interface AutoRecordingState {
    isRecording: boolean;              // 녹화 중 여부
    recordingFilename: string | null; // 녹화 파일명
    recordingStartedAt: string | null;// 녹화 시작 시각
    recordingUrl: string | null;      // 녹화된 S3 URL
    personsDetected: number;          // 최초 탐지된 인원 수
    maxDetected: number | null;       // 세그먼트 내 최대 인원 수
    duration: number | null;          // 녹화 지속 시간 (초)

    // 🚀 액션 메서드들
    startAutoRecording: (payload: AutoRecordingStarted) => void;   // 자동 녹화 시작
    stopAutoRecording: (payload: AutoRecordingFinalized) => void;  // 자동 녹화 종료
    reset: () => void;                                             // 상태 초기화
}

// ✅ zustand 스토어 생성
export const useAIStore = create<AutoRecordingState>((set) => ({
    isRecording: false,
    recordingFilename: null,
    recordingStartedAt: null,
    recordingUrl: null,
    personsDetected: 0,
    maxDetected: null,
    duration: null,

    /**
     * 자동 녹화가 시작될 때 호출됩니다.
     * @param payload - 녹화 시작 정보 (파일명, 시작시간, 감지 인원수 등)
     */
    startAutoRecording: ({ filename, started_at, initial_persons }) => {
        // 📣 UI에 녹화 시작 메시지를 띄웁니다.
        useSnackbarStore.getState().enqueueSnackbar({
            message: `🎥 자동 녹화 시작: ${filename}`,
            type: 'info',
        });

        // 상태 업데이트
        set({
            isRecording: true,
            recordingFilename: filename,
            recordingStartedAt: started_at,
            personsDetected: initial_persons,
        });
    },

    /**
     * 자동 녹화가 종료되고 저장되었을 때 호출됩니다.
     * @param payload - 녹화 완료 정보 (파일명, 저장 URL, 최대 인원, 지속 시간 등)
     */
    stopAutoRecording: ({ filename, s3_url, segment_max_persons, duration_sec }) => {
        // 📣 UI에 녹화 완료 메시지를 띄웁니다.
        useSnackbarStore.getState().enqueueSnackbar({
            message: `✅ 녹화 저장 완료: ${filename}`,
            type: 'success',
        });

        // 상태 업데이트
        set({
            isRecording: false,
            recordingFilename: filename,
            recordingUrl: s3_url,
            maxDetected: segment_max_persons,
            duration: duration_sec,
        });
    },

    /**
     * 모든 상태를 초기값으로 되돌립니다.
     */
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
