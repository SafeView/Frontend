import axios from 'axios';
import type { FaceDetectionResponse } from '../types/faceDetection';

/**
 * 영상에서 특정 시간대 얼굴 이미지 추출 요청
 * @param videoUrl 영상 URL (로컬 or S3)
 * @param timeInput "1 30" 형태 (분 초)
 */
export const detectFacesAtTime = async (
    videoUrl: string,
    timeInput: string,
    fromS3: boolean = false
): Promise<FaceDetectionResponse> => {
    const baseUrl = 'http://localhost:8000/face-detection/detect-faces';
    const params = new URLSearchParams({
        video_url: videoUrl,
        time_input: timeInput,
        from_s3: String(fromS3),
    });

    const { data } = await axios.post<FaceDetectionResponse>(`${baseUrl}?${params.toString()}`);
    console.log('Face detection response:', data);
    return data;
};

/**
 * 파일을 직접 업로드하여 얼굴 검출 (FastAPI의 UploadFile 지원 사용)
 * - 엔드포인트: POST http://localhost:8000/face-detection/detect-faces?time_input=MM%20SS
 * - Body: multipart/form-data, field name: "file"
 */
export const detectFacesFromFile = async (
    file: File,
    timeInput: string,
): Promise<FaceDetectionResponse> => {
    const url = `http://localhost:8000/face-detection/detect-faces?time_input=${encodeURIComponent(timeInput)}`;
    const form = new FormData();
    form.append('file', file, file.name);
    const { data } = await axios.post<FaceDetectionResponse>(url, form);
    return data;
};
