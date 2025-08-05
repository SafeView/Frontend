// 비디오(녹화/저장/다운로드/목록) 관련 상태를 zustand로 관리하는 스토어입니다.
// 녹화 상태, 비디오 목록, 다운로드 링크, 에러 등 상태와 메서드를 제공합니다.

import { create } from 'zustand';
import {
  startVideoRecording,
  stopVideoRecording,
  getAllVideos,
  getVideoDownloadUrl,
} from '../services/videoService';
import type {
  VideoItem,
  VideoRecordResponseData,
  VideoDownloadResponseData,
} from '../types/video';

interface VideoState {
  videos: VideoItem[]; // 전체 비디오 목록
  recording: boolean; // 녹화 중 여부
  lastRecordResult: VideoRecordResponseData | null; // 마지막 녹화 결과
  downloadUrl: string | null; // 다운로드 링크
  loading: boolean; // 로딩 상태
  error: string | null; // 에러 메시지

  fetchVideos: () => Promise<void>; // 비디오 목록 불러오기
  startRecording: () => Promise<void>; // 녹화 시작
  stopRecording: () => Promise<void>; // 녹화 중단 및 저장
  fetchDownloadUrl: (filename: string) => Promise<void>; // 다운로드 링크 요청
  clearError: () => void; // 에러 초기화
  clearDownloadUrl: () => void; // 다운로드 링크 초기화
}

const useVideoStore = create<VideoState>((set) => ({
  videos: [],
  recording: false,
  lastRecordResult: null,
  downloadUrl: null,
  loading: false,
  error: null,

  /**
   * 전체 비디오 목록을 불러옵니다.
   */
  fetchVideos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllVideos();
      set({ videos: data, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '비디오 목록을 불러오는 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 녹화를 시작합니다.
   */
  startRecording: async () => {
    set({ loading: true, error: null });
    try {
      const result = await startVideoRecording();
      set({ lastRecordResult: result, recording: true, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '녹화 시작 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 녹화를 중단하고 저장합니다.
   */
  stopRecording: async () => {
    set({ loading: true, error: null });
    try {
      const result = await stopVideoRecording();
      set({ lastRecordResult: result, recording: false, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '녹화 중단 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 비디오 다운로드 링크를 불러옵니다.
   * @param filename 다운로드 받을 파일명
   */
  fetchDownloadUrl: async (filename: string) => {
    set({ loading: true, error: null });
    try {
      const data: VideoDownloadResponseData = await getVideoDownloadUrl(filename);
      set({ downloadUrl: data.url, loading: false });
    } catch (err: any) {
      set({
        error: err.message || '비디오 다운로드 링크 요청 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },

  /**
   * 에러 상태를 초기화합니다.
   */
  clearError: () => set({ error: null }),

  /**
   * 다운로드 링크 상태를 초기화합니다.
   */
  clearDownloadUrl: () => set({ downloadUrl: null }),
}));

export default useVideoStore;
