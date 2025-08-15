// src/pages/AnalysisPage.tsx
import React, { useState } from 'react';
import VideoUpload from '../components/Analysis/VideoUpload';
import AnalysisResult from '../components/Analysis/AnalysisResult';
import styles from './AnalysisPage.module.css';

const AnalysisPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>🎥 영상 분석</h1>
            <div className={styles.section}>
                <VideoUpload onUpload={setVideoFile} />
            </div>

            {videoFile && (
                <div className={styles.section}>
                    <AnalysisResult videoFile={videoFile} onAnalyzed={setAnalysisData} />
                </div>
            )}
        </div>
    );
};

export default AnalysisPage;
