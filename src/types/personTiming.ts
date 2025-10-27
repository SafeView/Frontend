// 사람 등장 시간대 분석 API 응답 타입
export interface PersonTimingResponse {
    person_timings: string[];   // 사람이 등장한 시간 구간 (예: "00:00~00:05")
    total_segments: number;     // 총 탐지된 사람 등장 구간 수
    similarity_threshold?: number; // (선택적) 유사도 임계값 (예: 0.8)
}

// 에러 응답 예외 타입
export interface PersonTimingError {
    detail: string;             // 예: "지원하지 않는 파일 형식입니다..."
}
