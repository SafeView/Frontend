// 비디오(녹화/저장/다운로드/목록) 관련 타입 정의 파일입니다.
// API 명세서를 기반으로 타입을 정의합니다.

import type { ApiResponse } from './common';

// 녹화 시작/중단 응답 데이터 타입
export interface VideoRecordResponseData {
  filename: string;         // 녹화 파일명
  s3_url: string | null;    // S3 업로드 URL (중단 시에만 값이 있음)
  error: string;            // 에러 메시지 (정상일 때 "no error")
}

// 녹화 시작/중단 응답 타입
export type VideoRecordResponse = ApiResponse<VideoRecordResponseData>;

// 비디오 엔티티( 사용자별 목록 조회용 )
export interface VideoItem {
  id: number;           // 비디오 ID
  userId: number;       // 사용자 ID
  filename: string;     // 파일명
  s3Url: string;        // S3 저장 URL
}

// 사용자별 비디오 전체 리스트 응답 타입
export type VideoListResponse = ApiResponse<VideoItem[]>;

// 다운로드 링크 응답 데이터 타입
export interface VideoDownloadResponseData {
  url: string;          // 다운로드 URL
  filename: string;     // 파일명
  error: string;        // 에러 메시지 (정상일 때 "no error")
}

// 다운로드 링크 응답 타입
export type VideoDownloadResponse = ApiResponse<VideoDownloadResponseData>;

// 관리자, 중간 관리자용 전체 비디오 리스트 조회 응답용 타입 추가
export interface AdminVideoItem {
    userId: number;
    filenames: string[];
    s3Urls: string[];
}

export type VideoListForAdminResponse = ApiResponse<AdminVideoItem[]>;
