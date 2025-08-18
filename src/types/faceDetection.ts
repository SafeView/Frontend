export interface FaceImage {
    s3_url: string;
}

export interface FaceDetectionResponse {
    faces: FaceImage[];
}
