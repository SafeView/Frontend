// src/components/Analysis/VideoUpload.tsx
import React, {type ChangeEvent, useEffect, useState} from 'react';
import styles from './VideoUpload.module.css';
import useFaceDetectionStore from '../../stores/faceDetectionStore';


interface Props {
    onUpload: (faceUrls: string[]) => void;
}

const VideoUpload: React.FC<Props> = ({ onUpload }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('');
    const [uploading, setUploading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    // ✅ zustand 스토어 훅
    const { faces, loading, error, detect, detectFromFile, clear } = useFaceDetectionStore();


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            // ✅ 500MB 제한: 524,288,000 bytes
            const MAX_SIZE = 524288000;
            if (selected.size > MAX_SIZE) {
                setFile(null);
                setPreviewUrl(null);
                clear();
                setLocalError('⚠️ 업로드 가능한 최대 용량은 500MB입니다.');
                return;
            }

            // ✅ mp4 확장자/타입 체크
            const fileName = selected.name.toLowerCase();
            const fileType = selected.type.toLowerCase();
            if (!fileName.endsWith('.mp4') || fileType !== 'video/mp4') {
                setFile(null);
                setPreviewUrl(null);
                clear();
                setLocalError('⚠️ mp4 형식의 영상 파일만 업로드할 수 있습니다.');
                return;
            }

            // ✅ 통과하면 상태 업데이트
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setPreviewUrl(url);
            clear(); // 새로운 파일 업로드 시 상태 초기화
            setLocalError(null);
        }
    };


    const handleAnalyze = async () => {
        setLocalError(null);
        if (!file) {
            setLocalError('파일을 선택하세요.');
            return;
        }
        if (!minute || !second) {
            setLocalError('분/초를 입력하세요.');
            return;
        }

        const time_input = `${minute} ${second}`;
        try {
            setUploading(true);
            // FastAPI가 파일 업로드를 직접 받으므로, 바로 전송해 처리
            await detectFromFile(file, time_input);
        } catch (e: any) {
            setLocalError(e.message || '업로드 또는 분석 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
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
                accept="video/mp4"
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
                            disabled={loading || uploading}
                        >
                            {uploading || loading ? '분석 중...' : '분석 시작'}
                        </button>
                    </div>

                    {localError && <p className={styles.error}>⚠️ {localError}</p>}
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
