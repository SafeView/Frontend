import axios from 'axios';
import type {FaceDetectionResponse} from '../types/faceDetection';

/**
 * 영상에서 특정 시간대 얼굴 이미지 추출 요청
 * @param videoUrl 영상 URL (로컬 or S3)
 * @param timeInput "1 30" 형태 (분 초)
 */
export const detectFacesAtTime = async (
    videoUrl: string,
    timeInput: string
): Promise<FaceDetectionResponse> => {
    const baseUrl = 'http://localhost:8000/face-detection/detect-faces';
    const params = new URLSearchParams({
        video_url: videoUrl,
        time_input: timeInput,
        from_s3: 'false', // 또는 'true' 상황에 맞게
    });

    const { data } = await axios.post<FaceDetectionResponse>(`${baseUrl}?${params.toString()}`);
    return data;
};
