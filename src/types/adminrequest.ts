// MODERATOR(중간 관리자) 권한 요청 관련 타입 정의 파일입니다.
// API 명세서를 기반으로 타입을 정의합니다.

import type { ApiResponse } from './common'; // 공통 응답 타입 import

// 권한 요청 상태 타입
export type AdminRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// MODERATOR 권한 요청 생성 요청 바디
export interface CreateAdminRequestBody {
  title: string;         // 요청 제목
  description: string;   // 요청 상세 설명
}

// MODERATOR 권한 요청 상세 타입
export interface AdminRequestDetail {
  id: number;                    // 요청 ID
  userId: number;                // 요청자(유저) ID
  title: string;                 // 요청 제목
  description: string | null;    // 요청 상세 설명
  status: AdminRequestStatus;    // 요청 상태
  adminComment: string | null;   // 어드민 코멘트
  processedAt: string | null;    // 어드민 처리 시간
  processedBy: number | null;    // 요청 처리한 어드민 ID
  createdAt: string;             // 생성일시
  updatedAt: string;             // 수정일시
}

// 내 요청 목록(간략) 타입
export interface AdminRequestSummary {
  id: number;                 // 요청 ID
  title: string;              // 요청 제목
  status: AdminRequestStatus; // 요청 상태
  createdAt: string;          // 생성일시
}

// 내 요청 목록 응답 타입
export type AdminRequestListResponse = ApiResponse<AdminRequestSummary[]>;

// 내 요청 상세 응답 타입
export type AdminRequestDetailResponse = ApiResponse<AdminRequestDetail>;

// MODERATOR 권한 요청 생성 응답 타입
export type CreateAdminRequestResponse = ApiResponse<AdminRequestDetail>;

// 내 대기중 요청 개수 응답 타입
export type PendingAdminRequestCountResponse = ApiResponse<number>;

