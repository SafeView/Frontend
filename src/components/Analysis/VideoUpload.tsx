// src/components/Analysis/VideoUpload.tsx
import React, { type ChangeEvent, useState } from 'react';
import styles from './VideoUpload.module.css';

interface Props {
    onUpload: (file: File) => void;
}

const VideoUpload: React.FC<Props> = ({ onUpload }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className={styles.container}>
            <label htmlFor="video-upload" className={styles.label}>분석할 영상 파일 선택</label>
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
                <video className={styles.preview} controls>
                    <source src={previewUrl} type="video/mp4" />
                    미리보기를 지원하지 않는 브라우저입니다.
                </video>
            )}
        </div>
    );
};

export default VideoUpload;
