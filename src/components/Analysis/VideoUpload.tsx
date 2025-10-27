// src/components/Analysis/VideoUpload.tsx
import React, { type ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './VideoUpload.module.css';
import useFaceDetectionStore from '../../stores/faceDetectionStore';
import usePersonTimingStore from '../../stores/personTimingStore';
import useFaceRecognitionTimingStore from "../../stores/faceRecognitionTimingStore.ts";


interface Props {
    onUpload: (faceUrls: string[]) => void;
    onPersonTimingResult?: (timings: string[]) => void;
}

const VideoUpload: React.FC<Props> = ({ onUpload, onPersonTimingResult }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('');
    const [uploading, setUploading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [videoDuration, setVideoDuration] = useState<number | null>(null); // 영상 전체 길이 (초)

    const videoRef = useRef<HTMLVideoElement>(null);

    // ✅ zustand 스토어 훅
    const { faces, loading, error, detect, detectFromFile, clear } = useFaceDetectionStore();

    const {
        analyze: analyzePersonTiming,
        timings,
        total,
        error: personError,
        loading: personLoading,
        clear: clearPersonTiming,
    } = usePersonTimingStore();

    // 인물(사진+비디오) 기반 분석 스토어
    const {
        analyze: analyzeFaceRecognitionTiming,
        timings: faceTimings,
        threshold,
        error: faceError,
        loading: faceLoading,
        clear: clearFaceRecognition,
    } = useFaceRecognitionTimingStore();


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            // ✅ 500MB 제한 (500 * 1024 * 1024 bytes)
            const MAX_SIZE = 500 * 1024 * 1024; // 524,288,000 bytes
            console.log('selected.size:', selected.size);

            if (selected.size > MAX_SIZE) {
                setVideoFile(null);
                setPreviewUrl(null);
                clear();
                const msg = '⚠️ 파일 크기 제한 오류 (최대 500MB)';
                setLocalError(msg);
                alert(msg); // 🔔 사용자에게 즉시 알림
                return;
            }

            // ✅ mp4 확장자/타입 체크
            const fileName = selected.name.toLowerCase();
            const fileType = selected.type.toLowerCase();
            if (!fileName.endsWith('.mp4') || fileType !== 'video/mp4') {
                setVideoFile(null);
                setPreviewUrl(null);
                clear();
                const msg = '⚠️ 올바르지 않은 형식입니다.';
                setLocalError(msg);
                alert(msg);
                return;
            }

            // ✅ 통과하면 상태 업데이트
            setVideoFile(selected);
            const url = URL.createObjectURL(selected);
            setPreviewUrl(url);
            clear(); // 새로운 파일 업로드 시 상태 초기화
            clearPersonTiming();
            setLocalError(null);
        }
    };

    /** 🖼️ 인물 사진 파일 선택 */
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        setImageFile(selected);
        setImagePreviewUrl(URL.createObjectURL(selected)); // ✅ 사진 미리보기 생성
    };


    // 🔹 영상 길이 측정
    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        if (video) {
            setVideoDuration(video.duration); // 초 단위
        }
    };


    /** 기본 얼굴/사람 구간 분석 */
    const handleAnalyze = async () => {
        setLocalError(null);
        if (!videoFile) {
            setLocalError('파일을 선택하세요.');
            return;
        }
        if (!minute || !second) {
            setLocalError('분/초를 입력하세요.');
            return;
        }

        const min = Number(minute);
        const sec = Number(second);

        if (isNaN(min) || isNaN(sec) || min < 0 || sec < 0) {
            setLocalError(' 잘못된 입력 - 유효한 숫자(0 이상의 정수)를 입력해주세요.');
            return;
        }

        const inputSeconds = min * 60 + sec;
        if (videoDuration !== null && inputSeconds > videoDuration) {
            setLocalError(` 잘못된 입력 - 영상 길이(${Math.floor(videoDuration)}초)를 초과했습니다.`);
            return;
        }

        const time_input = `${min} ${sec}`;

        try {
            setUploading(true);

            // ✅ 1. 얼굴 분석
            await detectFromFile(videoFile, time_input);

            // ✅ 2. 사람 등장 구간 분석
            await handlePersonTimingAnalyze();


        } catch (e: any) {
            setLocalError(e.message || '업로드 또는 분석 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    const handlePersonTimingAnalyze = async () => {
        if (!videoFile) {
            setLocalError('파일을 선택하세요.');
            return;
        }

        try {
            setUploading(true);
            console.log('📌 사람 등장 구간 분석 시작 :', videoFile);
            await analyzePersonTiming(videoFile); // ✅ 사람 등장 구간 분석 실행
        } catch (e: any) {
            setLocalError(e.message || '사람 등장 구간 분석 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    /** ✅ 사진 + 비디오 기반 특정 인물 등장 시간 분석 */
    const handleFaceRecognitionAnalyze = async () => {
        if (!imageFile || !videoFile) {
            alert('사진과 영상을 모두 업로드해야 합니다.');
            return;
        }

        try {
            setUploading(true);
            console.log('📌 특정 인물 등장 구간 분석 시작 :', imageFile, videoFile);
            await analyzeFaceRecognitionTiming(imageFile, videoFile);



        } catch (e: any) {
            setLocalError(e.message || '인물 등장 구간 분석 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    // ✅ 얼굴 검출 완료 후 상위 컴포넌트로 전달
    useEffect(() => {
        const faceUrls = faces.map((f) => f.s3_url);
        if (faceUrls.length > 0) {
            onUpload(faceUrls); // 얼굴 결과
        }

        if (timings.length > 0 && onPersonTimingResult) {
            onPersonTimingResult(timings); // ✅ 사람 시간대 결과
        }
    }, [faces, onPersonTimingResult, onUpload, timings]);


    useEffect(() => {
        if (timings.length > 0) {
            console.log('📌 탐지된 사람 등장 시간 구간:', timings);
        }
    }, [timings]);

    return (
        <div className={styles.container}>
            <label htmlFor="video-upload" className={styles.label}>분석할 영상 선택</label>
            <input
                id="video-upload"
                type="file"
                onChange={handleFileChange}
                className={styles.input}
            />
            <button
                type="button"
                className={styles.uploadButton}
                onClick={() => document.getElementById('video-upload')?.click()}
            >
                동영상 업로드
            </button>

            {previewUrl && (
                <>
                    <video
                        ref={videoRef} // 🔧 추가!
                        className={styles.preview}
                        controls
                        onLoadedMetadata={handleLoadedMetadata} // 🔧 추가!
                    >
                        <source src={previewUrl} type="video/mp4" />
                        비디오 미리보기를 지원하지 않습니다.
                    </video>

                    <label className={styles.label}>인물 사진 선택</label>
                    <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className={styles.input} />
                    <button
                        type="button"
                        className={styles.uploadButton}
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        인물 사진 업로드
                    </button>

                    {imagePreviewUrl && (
                        <img src={imagePreviewUrl} alt="사진 미리보기" className={styles.imagePreview} />
                    )}

                    <div className={styles.inputRow}>
                        <div className={styles.timeRow}>
                        <input
                            type="number"
                            placeholder="분"
                            value={minute}
                            onChange={(e) => setMinute(e.target.value)}
                            className={styles.timeInput}
                        />
                        <input
                            type="number"
                            placeholder="초"
                            value={second}
                            onChange={(e) => setSecond(e.target.value)}
                            className={styles.timeInput}
                        />
                            </div>
                        <div className={styles.buttonGroup}>
                        <button
                            className={styles.analyzeButton}
                            onClick={handleAnalyze}
                            disabled={loading || uploading}
                        >
                            {uploading || loading ? '분석 중...' : '분석 시작'}
                        </button>
                        <button
                            className={styles.analyzeButton}
                            onClick={handleFaceRecognitionAnalyze}
                            disabled={uploading || faceLoading}
                        >
                            {uploading || faceLoading ? '인물 분석 중...' : '특정 인물 등장 분석'}
                        </button>
                        </div>
                    </div>

                    {localError && <p className={styles.error}>⚠️ {localError}</p>}
                    {error && <p className={styles.error}>⚠️ {error}</p>}
                    {threshold && (
                        <p className={styles.info}>🔹 유사도 임계값 : {threshold.toFixed(2)}</p>
                    )}
                    {faceTimings.length > 0 && (
                        <div className={styles.resultBox}>
                            <p className={styles.info}>🎯   해당 인물 등장 시간대 :</p>
                            <ul className={styles.timingsList}>
                                {faceTimings.map((t, idx) => (
                                    <li key={idx}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}

            <button
                type="button"
                className={styles.uploadButton}
                onClick={async () => {
                    const testUrl = 'https://gitpolio-images.s3.ap-northeast-2.amazonaws.com/facetest/%E1%84%86%E1%85%A2%E1%84%8C%E1%85%A1%E1%86%BC_%E1%84%8B%E1%85%A7%E1%86%BC%E1%84%89%E1%85%A1%E1%86%BC_%E1%84%90%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%87%E1%85%B3%E1%86%AF_%E1%84%89%E1%85%B5%E1%86%A8%E1%84%83%E1%85%A1%E1%86%BC_%E1%84%87%E1%85%A7%E1%86%AB%E1%84%80%E1%85%A7%E1%86%BC+(1).mp4';
                    const timeInput = '0 5';

                    await detect(testUrl, timeInput);
                }}
                disabled={loading}
            >
                {loading ? '분석 중...' : '테스트 영상으로 분석'}
            </button>
        </div>
    );
};

export default VideoUpload;
