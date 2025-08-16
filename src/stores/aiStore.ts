import { create } from 'zustand';
import type { AutoRecordingStarted, AutoRecordingFinalized } from '../types/autorecording.ts'; // 또는 너가 정의한 위치

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


    // ✅ 타입 명시만 AutoRecordingStarted 사용
    // type: 'auto_recording_started';
    // filename: string;
    // started_at: string;
    // initial_persons: number;
    // storage: 'S3';
    startAutoRecording: ({ filename, started_at, initial_persons }) =>
        set({
            isRecording: true,
            recordingFilename: filename,
            recordingStartedAt: started_at,
            personsDetected: initial_persons
        }),

    // ✅ 타입 명시만 AutoRecordingFinalized 사용
    // type: 'auto_recording_finalized';
    // filename: string;
    // segment_max_persons: number;
    // duration_sec: number;
    // storage: 'S3';
    // s3_url: string;
    stopAutoRecording: ({ filename, s3_url, segment_max_persons, duration_sec }) =>
        set({
            isRecording: false,
            recordingFilename: filename,
            recordingUrl: s3_url,
            maxDetected: segment_max_persons,
            duration: duration_sec

        }),

    reset: () =>
        set({
            isRecording: false,
            recordingFilename: null,
            recordingStartedAt: null,
            recordingUrl: null,
            personsDetected: 0
        })
}));
