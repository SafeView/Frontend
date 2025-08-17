import axios from 'axios';
import type {FaceDetectionResponse} from '../types/faceDetection';

/**
 * 영상에서 특정 시간대 얼굴 이미지 추출 요청
 * @param videoUrl S3 영상 URL
 * @param timeInput '1 30' 형식 (분 초)
 */
export const detectFacesAtTime = async (
    videoUrl: string,
    timeInput: string
): Promise<FaceDetectionResponse> => {
    const endpoint = 'http://localhost:8000/face-detection/detect-faces';

    const url = `${endpoint}?video_url=${encodeURIComponent(videoUrl)}&time_input=${encodeURIComponent(timeInput)}`;

    const { data } = await axios.get<FaceDetectionResponse>(url);
    return data;
};
