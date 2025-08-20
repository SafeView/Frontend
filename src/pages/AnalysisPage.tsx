// src/pages/AnalysisPage.tsx

import React, { useState } from 'react';
import VideoUpload from '../components/Analysis/VideoUpload';           // 📤 영상 업로드 컴포넌트
import AnalysisResult from '../components/Analysis/AnalysisResult';   // 📊 분석 결과 표시 컴포넌트
import styles from './AnalysisPage.module.css';                       // 🎨 페이지 전용 스타일
import { useUIStore } from "../stores/uiStore.ts";                    // ✅ UI 상태 (예: 사이드바 열림 여부)

/**
 * 🎥 영상 분석 페이지
 * - 영상 파일 업로드 → 얼굴 탐지 → 결과 출력
 */
const AnalysisPage: React.FC = () => {
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen); // 사이드바 열림 여부 확인

    // 🔎 분석 결과 데이터 상태 (향후 확장 가능)
    // const [videoFile, setVideoFile] = useState<File | null>(null); // 현재 사용 안 함
    // @ts-ignore: 분석 결과 타입 미정이라 일시적으로 any 사용
    const [analysisData, setAnalysisData] = useState<any>(null);

    // 🧠 얼굴 탐지 결과 URL 목록 (예: S3 업로드된 얼굴 이미지 링크 배열)
    const [faceUrls, setFaceUrls] = useState<string[] | null>(null);

    return (
        <div
            className={styles.container}
            style={{
                // ✅ 사이드바 상태에 따라 좌측 여백 조정
                marginLeft: isSidebarOpen ? "0px" : "50px",
            }}
        >
            {/* 페이지 타이틀 */}
            <h1 className={styles.title}>🎥 영상 분석</h1>

            {/* 영상 업로드 영역 */}
            <div className={styles.section}>
                {/* 업로드 후 setFaceUrls로 얼굴 URL 전달 */}
                <VideoUpload onUpload={setFaceUrls} />
            </div>

            {/* 얼굴 URL이 있으면 결과 렌더링 */}
            {faceUrls && (
                <div className={styles.section}>
                    <AnalysisResult faceUrls={faceUrls} />
                </div>
            )}
        </div>
    );
};

export default AnalysisPage;
