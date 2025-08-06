// src/types/common.ts

/**
 * ✅ 모든 API 응답에 공통적으로 사용되는 래퍼 타입
 */
export interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    data: T;
}
