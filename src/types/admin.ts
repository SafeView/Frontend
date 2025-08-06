// src/types/admin.ts
import type { ApiResponse } from './common'; // 공통 타입 불러오기
// 공통 타입 불러오기

export type AdminRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminRequest {
    id: number;
    userId: number;
    title: string;
    description?: string | null;
    status: AdminRequestStatus;
    adminComment?: string | null;
    processedAt?: string | null;
    processedBy?: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface AdminDecisionBody {
    adminComment: string;
}

// 응답 타입들
export type AdminRequestListResponse = ApiResponse<AdminRequest[]>;
export type AdminRequestDetailResponse = ApiResponse<AdminRequest>;
export type AdminDecisionResponse = ApiResponse<AdminRequest>;
