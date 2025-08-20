import api from '../apis/api';
import type { ApiResponse } from '../types/common';

/**
 * 📦 업로드 응답 데이터 형식
 * - 업로드가 성공하면, 서버에서 접근 가능한 영상 URL을 반환합니다.
 */
export interface UploadResponseData {
    url: string; // 업로드된 파일을 백엔드/스토리지에서 접근 가능한 URL
}

/**
 * 🧾 업로드 응답 형식 (공통 API 응답 포맷 사용)
 * - isSuccess, message, data 포함
 */
export type UploadResponse = ApiResponse<UploadResponseData>;

/**
 * 📤 로컬 비디오 파일 업로드 함수
 *
 * - 사용자가 선택한 `.mp4` 등의 비디오 파일을 FormData 형태로 서버에 전송합니다.
 * - 서버에서는 `/videos/upload` 같은 멀티파트 수신 엔드포인트에서 파일을 받아 저장합니다.
 * - 저장 후 접근 가능한 URL을 응답으로 전달합니다.
 *
 * @param file HTML File 객체 (보통 `<input type="file">`로부터 얻은)
 * @returns UploadResponseData - 업로드된 비디오의 접근 URL (e.g., http://localhost:8080/videos/xxx.mp4)
 * @throws Error - 업로드 실패 시 상세한 메시지를 포함한 예외 발생
 */
export const uploadVideoFile = async (file: File): Promise<UploadResponseData> => {
    const form = new FormData();            // multipart/form-data 생성
    form.append('file', file);              // "file" 필드에 실제 파일 추가

    try {
        // 🔗 POST /videos/upload 요청 (백엔드에 파일 업로드)
        const res = await api.post<UploadResponse>('/videos/upload', form);

        // ✅ 서버에서 정상적으로 응답을 준 경우
        if (res.data && res.data.isSuccess) {
            return res.data.data; // 업로드된 파일 URL 반환
        }

        // ❗ 실패 응답인 경우 → 서버 메시지 포함 예외 발생
        throw new Error(res.data?.message || '업로드 실패');
    } catch (e: any) {
        // ❗ 네트워크 오류 또는 기타 예외 상황 → 상세 메시지 포함 예외 발생
        throw new Error(
            e.response?.data?.message || e.message || '업로드 중 오류가 발생했습니다.'
        );
    }
};
