// 비디오(녹화/저장/다운로드/목록) 관련 API 호출 함수 모음입니다.
// 각 함수는 강력한 예외처리와 상세한 주석을 포함합니다.

import api from '../apis/api';
import type {
    VideoRecordResponse,
    VideoRecordResponseData,
    VideoListResponse,
    VideoItem,
    VideoDownloadResponse,
    VideoDownloadResponseData,
    VideoListForAdminResponse,
    AdminVideoItem,
} from '../types/video';
import axios from "axios";

/**
 * 녹화 시작 요청
 * @returns 녹화 시작 결과 데이터 (filename, s3_url, error)
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const startVideoRecording = async (): Promise<VideoRecordResponseData> => {
  try {
    const response = await api.post<VideoRecordResponse>('/videos/start');
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '녹화 시작에 실패했습니다.');
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || '녹화 시작 중 네트워크 오류가 발생했습니다.'
    );
  }
};

/**
 * 녹화 중단 및 저장 요청
 * @returns 녹화 중단 결과 데이터 (filename, s3_url, error)
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const stopVideoRecording = async (): Promise<VideoRecordResponseData> => {
  try {
    const response = await api.post<VideoRecordResponse>('/videos/stop');
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '녹화 중단에 실패했습니다.');
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || '녹화 중단 중 네트워크 오류가 발생했습니다.'
    );
  }
};

/**
 * 사용자별 전체 비디오 리스트 조회
 * @returns 비디오 목록 배열
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const getAllVideos = async (): Promise<VideoItem[]> => {
  try {
    const response = await api.get<VideoListResponse>('/videos/all');
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '비디오 목록 조회에 실패했습니다.');
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || '비디오 목록 조회 중 네트워크 오류가 발생했습니다.'
    );
  }
};

/**
 * 비디오 다운로드 링크 요청
 * @param filename 다운로드 받을 파일명
 * @returns 다운로드 링크 데이터 (url, filename, error)
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const getVideoDownloadUrl = async (
  filename: string
): Promise<VideoDownloadResponseData> => {
  try {
    const response = await api.get<VideoDownloadResponse>(`/videos/download/${filename}`);
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '비디오 다운로드 링크 요청에 실패했습니다.');
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || '비디오 다운로드 링크 요청 중 네트워크 오류가 발생했습니다.'
    );
  }
};

/**
 * 🔐 관리자/중간관리자 전용 전체 비디오 리스트 조회
 * @returns 모든 유저의 비디오 목록
 * @throws Error - API 실패 또는 네트워크 오류
 */
export const getAllVideosForAdmin = async (): Promise<AdminVideoItem[]> => {
    try {
        const response = await api.get<VideoListForAdminResponse>('/videos/all/videos'); // ✅ 관리자용 endpoint
        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || '전체 비디오 목록 조회에 실패했습니다.');
        }
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || '전체 비디오 목록 조회 중 네트워크 오류가 발생했습니다.'
        );
    }
};

/**
 * 📡 웹소켓 연결 전에 AI 서버에 사용자 ID 전송 (쿠키 기반 인증 포함)
 * @param userId 현재 로그인된 사용자 ID (숫자)
 * @throws Error - 요청 실패 또는 네트워크 오류
 */
export const sendUserIdToAIServer = async (userId: number): Promise<void> => {
    try {
        const response = await axios.post(
            'http://localhost:8000/client/user',
            { userId: String(userId) }, // ✅ 문자열로 전송
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // ✅ 쿠키 포함
            }
        );

        const { success, message } = response.data;
        if (!success) {
            throw new Error(message || 'AI 서버에 사용자 ID 전송에 실패했습니다.');
        }

        console.log('[AI 서버 응답]', response.data);
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'AI 서버에 사용자 ID 전송 중 네트워크 오류가 발생했습니다.'
        );
    }
};
