// 🎥 사람 등장 구간 분석 API 호출 함수
// - 업로드한 비디오에서 사람이 등장하는 시간대를 분석
// - MP4, AVI, MOV, MKV 형식만 지원됨

import api from '../apis/api';
import type { PersonTimingResponse } from '../types/personTiming';

/**
 * ✅ 사람 등장 구간 분석 요청
 *
 * @param videoFile - 업로드할 비디오 파일
 * @returns PersonTimingResponse - 시간 구간 배열 및 총 세그먼트 수
 * @throws Error - 파일 형식 오류 또는 분석 실패 시 예외 발생
 */
export const analyzePersonTiming = async (
    videoFile: File
): Promise<PersonTimingResponse> => {
    try {
        const formData = new FormData();
        formData.append('video', videoFile); // 백엔드에서 'video' 키로 받음

        const response = await api.post<PersonTimingResponse>(
            '/person-timing/analyze',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error: any) {
        // ❌ 백엔드 오류 메시지 직접 전달
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error('사람 등장 구간 분석 중 오류가 발생했습니다.');
    }
};
