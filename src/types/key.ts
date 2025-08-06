// 복호화 키 발급 및 검증 관련 타입 정의 파일입니다.
// API 명세서를 기반으로 타입을 정의합니다.

import type { ApiResponse } from './common';

// 키 발급 응답 데이터 타입
export interface KeyIssueData {
  accessToken: string;         // 발급된 accessToken
  expiresAt: string;           // 만료 시각 (ISO 문자열)
  issuedAt: string;            // 발급 시각 (ISO 문자열)
  blockchainTxHash: string;    // 블록체인 트랜잭션 해시
  keyHash: string;             // 키 해시값
  keyType: string;             // 키 타입 (예: CCTV_AES256)
  keyStatus: string;           // 키 상태 (예: ACTIVE)
  keyId: number;               // 키 고유 ID
  remainingUses: number;       // 남은 사용 가능 횟수
  totalUses: number;           // 전체 사용 가능 횟수
  usedCount: number;           // 이미 사용한 횟수
}

// 키 검증 요청 바디 타입
export interface KeyVerifyBody {
  accessToken: string;         // 발급받은 accessToken
  cameraId: string;            // 카메라 ID
}

// 키 검증 응답 데이터 타입
export interface KeyVerifyData {
  message: string;             // 검증 메시지
  canDecrypt: boolean;         // 복호화 가능 여부
  expiresAt: string;           // 키 만료 시각
  verifiedAt: string;          // 검증 시각
  decryptionToken: string;     // 복호화 토큰
  remainingUses: number;       // 남은 사용 가능 횟수
  cameraId: string;            // 카메라 ID
  blockchainTxHash: string;    // 블록체인 트랜잭션 해시
  blockchainVerified: boolean; // 블록체인 검증 여부
  valid: boolean;              // 키 유효성
}

// 응답 타입들
export type KeyIssueResponse = ApiResponse<KeyIssueData>;
export type KeyVerifyResponse = ApiResponse<KeyVerifyData>;
