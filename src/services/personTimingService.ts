// 🎥 사람 등장 구간 분석 API 호출 함수
// - 업로드한 비디오에서 사람이 등장하는 시간대를 분석
// - MP4, AVI, MOV, MKV 형식만 지원됨

import axios from 'axios';
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
        formData.append('file', videoFile);

        const response = await axios.post<PersonTimingResponse>(
            'http://localhost:8000/person-timing/analyze', // 포트 8000 고정 API 직접 호출
            formData,
            {
                withCredentials: true, // ✅ 쿠키 인증 사용하는 경우
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

/**
 * ✅ 사진 + 비디오 입력 기반 인물 등장 시간대 분석
 *
 * @param imageFile - 인물 사진 파일
 * @param videoFile - 분석 대상 비디오 파일
 * @returns PersonTimingResponse - 등장 시간 구간, 총 세그먼트 수, 유사도 임계값
 * @throws Error - 파일 형식 오류 또는 분석 실패 시 예외 발생
 */
export const analyzeFaceRecognitionTiming = async (
    imageFile: File,
    videoFile: File
): Promise<PersonTimingResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('file', videoFile);

        const response = await axios.post<PersonTimingResponse>(
            'http://localhost:8000/face-recognition-timing/analyze',
            formData,
            {
                withCredentials: true, // ✅ 쿠키 인증 사용하는 경우
            }
        );

        return response.data;
    } catch (error: any) {
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        }
        throw new Error('인물 등장 시간대 분석 중 오류가 발생했습니다.');
    }
};
