// 📽️ 자동 녹화 시작 이벤트 타입
export interface AutoRecordingStarted {
    type: 'auto_recording_started';
    filename: string;
    started_at: string; // ISO 8601
    initial_persons: number;
    storage: 'S3';
}

// 📁 자동 녹화 종료(저장 완료) 이벤트 타입
export interface AutoRecordingFinalized {
    type: 'auto_recording_finalized';
    filename: string;
    segment_max_persons: number;
    duration_sec: number;
    storage: 'S3';
    s3_url: string;
}
