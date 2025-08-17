// src/components/Analysis/AnalysisResult.tsx
import React from 'react';
import styles from './AnalysisResult.module.css';

interface Props {
    faceUrls: string[];
}

// interface AnalysisHistoryItemData {
//     filename: string;
//     timestamp: string;
//     objectsDetected: number;
// }

const AnalysisResult: React.FC<Props> = ({ faceUrls }) => {

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>🔍 분석된 얼굴</h3>
            <div className={styles.faceGrid}>
                {faceUrls.map((url, idx) => (
                    <img key={idx} src={url} alt={`face-${idx}`} className={styles.faceThumb} />
                ))}
            </div>
        </div>
    );
};

export default AnalysisResult;
