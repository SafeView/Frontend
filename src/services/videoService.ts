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
} from '../types/video';

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
