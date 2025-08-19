import api from '../apis/api';
import type { ApiResponse } from '../types/common';

export interface UploadResponseData {
  url: string; // 업로드된 파일을 백엔드/스토리지에서 접근 가능한 URL
}

export type UploadResponse = ApiResponse<UploadResponseData>;

/**
 * 로컬에서 선택한 비디오 파일을 서버로 업로드하고, 서버가 접근 가능한 URL을 반환합니다.
 * 백엔드(Java, baseURL=8080)에 `/videos/upload` 같은 멀티파트 엔드포인트가 있다고 가정합니다.
 * 필요시 경로를 실제 서버 엔드포인트로 맞추세요.
 */
export const uploadVideoFile = async (file: File): Promise<UploadResponseData> => {
  const form = new FormData();
  form.append('file', file);

  try {
  const res = await api.post<UploadResponse>('/videos/upload', form);
    if (res.data && res.data.isSuccess) {
      return res.data.data;
    }
    throw new Error(res.data?.message || '업로드 실패');
  } catch (e: any) {
    throw new Error(e.response?.data?.message || e.message || '업로드 중 오류가 발생했습니다.');
  }
};
