// src/pages/AnalysisPage.tsx
import React, { useState } from 'react';
import VideoUpload from '../components/Analysis/VideoUpload';
import AnalysisResult from '../components/Analysis/AnalysisResult';
import styles from './AnalysisPage.module.css';
import {useUIStore} from "../stores/uiStore.ts";

const AnalysisPage: React.FC = () => {
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

    const [videoFile, setVideoFile] = useState<File | null>(null);
    // @ts-ignore
    const [analysisData, setAnalysisData] = useState<any>(null);

    return (
        <div className={styles.container}
             style={{
                 marginLeft: isSidebarOpen ? "0px" : "50px",  // ✅ 사이드바 상태에 따라 여백 조정
             }}>
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
