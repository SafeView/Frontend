import axios from 'axios';
import type { FaceDetectionResponse } from '../types/faceDetection';

/**
 * 🎯 영상에서 특정 시간대에 등장하는 얼굴 이미지 추출 요청
 *
 * - 백엔드 FastAPI 서버의 `/face-detection/detect-faces` 엔드포인트 호출
 * - 영상은 URL 기반으로 제공되며, 특정 시간("1 30" → 1분 30초)에 등장한 얼굴들을 분석
 *
 * @param videoUrl 영상 URL (로컬 파일 경로 or S3 URL)
 * @param timeInput 추출 대상 시간 ("분 초" 형식, 예: "0 45")
 * @param fromS3 영상이 S3에 있는 경우 true (기본값: false)
 * @returns 얼굴 이미지 URL 배열 등의 분석 결과
 */
export const detectFacesAtTime = async (
    videoUrl: string,
    timeInput: string,
    fromS3: boolean = false
): Promise<FaceDetectionResponse> => {
    const baseUrl = 'http://localhost:8000/face-detection/detect-faces';

    // ⏱️ URL 파라미터 구성 (백엔드에서 Query로 받음)
    const params = new URLSearchParams({
        video_url: videoUrl,
        time_input: timeInput,
        from_s3: String(fromS3),
    });

    // 📡 POST 요청 (바디는 없고 쿼리스트링에 포함됨)
    const { data } = await axios.post<FaceDetectionResponse>(`${baseUrl}?${params.toString()}`);

    console.log('Face detection response:', data); // 디버깅용 로그
    return data;
};

/**
 * 🧾 파일 업로드 방식으로 얼굴 검출 요청
 *
 * - FastAPI에서 지원하는 `UploadFile` 기능을 활용
 * - 사용자가 직접 업로드한 영상 파일에 대해 특정 시점의 얼굴을 추출
 *
 * @param file 업로드할 영상 파일 (File 객체)
 * @param timeInput "분 초" 형식의 분석 시간 입력값 (예: "0 10")
 * @returns 얼굴 이미지 URL 배열 등의 분석 결과
 */
export const detectFacesFromFile = async (
    file: File,
    timeInput: string,
): Promise<FaceDetectionResponse> => {
    const url = `http://localhost:8000/face-detection/detect-faces?time_input=${encodeURIComponent(timeInput)}`;

    // 📦 multipart/form-data 구성
    const form = new FormData();
    form.append('file', file, file.name);

    // 📡 파일 업로드 + 분석 요청
    const { data } = await axios.post<FaceDetectionResponse>(url, form);
    return data;
};
