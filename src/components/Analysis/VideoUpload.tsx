// src/components/Analysis/VideoUpload.tsx
import React, {type ChangeEvent, useState } from 'react';
import styles from './VideoUpload.module.css';

interface Props {
    onUpload: (faceUrls: string[]) => void;
}

const VideoUpload: React.FC<Props> = ({ onUpload }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setPreviewUrl(url);
        }
    };

    const handleAnalyze = async () => {
        if (!previewUrl || !minute || !second) return;
        const time_input = `${minute} ${second}`;

        try {
            const res = await fetch(
                `http://localhost:8000/face-detection/detect-faces?video_url=${encodeURIComponent(previewUrl)}&time_input=${encodeURIComponent(time_input)}`
            );
            const data = await res.json();

            if (data.isSuccess) {
                onUpload(data.faces.map((f: { s3_url: string }) => f.s3_url)); // ✅ 결과만 넘김
            }
        } catch (e) {
            console.error('분석 실패:', e);
        }
    };

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
                        >
                            분석 시작
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoUpload;
