// src/components/Analysis/AnalysisResult.tsx
import React, { useEffect, useState } from 'react';
import styles from './AnalysisResult.module.css';
import AnalysisHistoryItem from './AnalysisHistoryItem';

interface Props {
    videoFile: File;
    onAnalyzed?: (data: any) => void;
}

interface AnalysisHistoryItemData {
    filename: string;
    timestamp: string;
    objectsDetected: number;
}

const AnalysisResult: React.FC<Props> = ({ videoFile, onAnalyzed }) => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [detectedCount, setDetectedCount] = useState<number | null>(null);
    const [summary, setSummary] = useState<string[]>([]);
    const [history, setHistory] = useState<AnalysisHistoryItemData[]>([]);

    useEffect(() => {
        const loadHistory = () => {
            const stored = localStorage.getItem('analysisHistory');
            if (stored) setHistory(JSON.parse(stored));
        };
        loadHistory();
    }, []);

    useEffect(() => {
        const simulateProgress = () => {
            let current = 0;
            const interval = setInterval(() => {
                current += Math.floor(Math.random() * 10) + 5;
                if (current >= 90) clearInterval(interval);
                setProgress(Math.min(current, 90));
            }, 300);
            return interval;
        };

        const analyzeVideo = async () => {
            setLoading(true);
            const interval = simulateProgress();

            try {
                const formData = new FormData();
                formData.append('video', videoFile);

                const res = await fetch('http://localhost:8000/api/analyze', {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();
                clearInterval(interval);
                setProgress(100);
                setResultUrl(data.resultUrl);
                setDetectedCount(data.objects?.length || 0);
                setSummary(data.timeline || []);

                const newItem: AnalysisHistoryItemData = {
                    filename: videoFile.name,
                    timestamp: new Date().toISOString(),
                    objectsDetected: data.objects?.length || 0,
                };
                const updatedHistory = [newItem, ...history];
                setHistory(updatedHistory);
                localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));

                if (onAnalyzed) onAnalyzed(data);
            } catch (error) {
                console.error('분석 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        analyzeVideo();
    }, [videoFile]);

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>📊 분석 결과</h3>

            {loading ? (
                <div className={styles.progressContainer}>
                    <p>분석 중입니다...</p>
                    <div className={styles.progressBarBg}>
                        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                    </div>
                </div>
            ) : (
                <>
                    {resultUrl && (
                        <video controls className={styles.video}>
                            <source src={resultUrl} type="video/mp4" />
                            브라우저에서 비디오를 지원하지 않습니다.
                        </video>
                    )}

                    <div className={styles.summary}>
                        <p><strong>탐지된 객체 수:</strong> {detectedCount}</p>
                        <p><strong>시간대별 탐지 요약:</strong></p>
                        <ul>
                            {summary.length > 0
                                ? summary.map((item, idx) => <li key={idx}>{item}</li>)
                                : <li>요약 정보 없음</li>
                            }
                        </ul>
                    </div>
                </>
            )}

            <div className={styles.history}>
                <h4>📁 분석 이력</h4>
                {history.length === 0 ? (
                    <p>저장된 분석 이력이 없습니다.</p>
                ) : (
                    <ul>
                        {history.map((item, idx) => (
                            <AnalysisHistoryItem
                                key={idx}
                                filename={item.filename}
                                timestamp={item.timestamp}
                                objectsDetected={item.objectsDetected}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AnalysisResult;
