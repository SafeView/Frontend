// src/components/Analysis/VideoUpload.tsx
import React, {type ChangeEvent, useEffect, useState} from 'react';
import styles from './VideoUpload.module.css';
import useFaceDetectionStore from '../../stores/faceDetectionStore';


interface Props {
    onUpload: (faceUrls: string[]) => void;
}

const VideoUpload: React.FC<Props> = ({ onUpload }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    //@ts-ignore
    const [file, setFile] = useState<File | null>(null);
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('');

    // ✅ zustand 스토어 훅
    const { faces, loading, error, detect, clear } = useFaceDetectionStore();


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setPreviewUrl(url);
            clear(); // 새로운 파일 업로드 시 상태 초기화
        }
    };


    const handleAnalyze = async () => {
        if (!previewUrl || !minute || !second) return;
        const time_input = `${minute} ${second}`;

        await detect(previewUrl, time_input);
    };

    // ✅ 얼굴 검출 완료 후 상위 컴포넌트로 전달
    useEffect(() => {
        if (faces.length > 0) {
            const urls = faces.map((f) => f.s3_url);
            onUpload(urls);
        }
    }, [faces, onUpload]);

    return (
        <div className={styles.container}>
            <label htmlFor="video-upload" className={styles.label}>분석할 영상 선택</label>
            <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className={styles.input}
            />
            <button
                type="button"
                className={styles.uploadButton}
                onClick={() => document.getElementById('video-upload')?.click()}
            >
                파일 업로드
            </button>

            {previewUrl && (
                <>
                    <video className={styles.preview} controls>
                        <source src={previewUrl} type="video/mp4" />
                        비디오 미리보기를 지원하지 않습니다.
                    </video>

                    <div className={styles.inputRow}>
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
                        <button
                            className={styles.analyzeButton}
                            onClick={handleAnalyze}
                            disabled={loading}
                        >
                            {loading ? '분석 중...' : '분석 시작'}
                        </button>
                    </div>

                    {error && <p className={styles.error}>⚠️ {error}</p>}
                </>
            )}

            <button
                type="button"
                className={styles.uploadButton}
                onClick={async () => {
                    const testUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
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
