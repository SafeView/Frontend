// src/components/Analysis/VideoUpload.tsx
import React, { type ChangeEvent } from 'react';
import styles from './VideoUpload.module.css';

interface Props {
    onUpload: (file: File) => void;
}

const VideoUpload: React.FC<Props> = ({ onUpload }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
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
        </div>
    );
};

export default VideoUpload;
