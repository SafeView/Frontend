// src/components/Analysis/AnalysisHistoryItem.tsx
import React from 'react';
import styles from './AnalysisHistoryItem.module.css';

interface HistoryItemProps {
    filename: string;
    timestamp: string;
    objectsDetected: number;
}

const AnalysisHistoryItem: React.FC<HistoryItemProps> = ({ filename, timestamp, objectsDetected }) => {
    return (
        <li className={styles.item}>
            <div className={styles.filename}>{filename}</div>
            <div className={styles.details}>
                <span>{objectsDetected}개 감지</span>
                <span className={styles.time}>{new Date(timestamp).toLocaleString()}</span>
            </div>
        </li>
    );
};

export default AnalysisHistoryItem;
