// React 핵심 라이브러리 import
import React from 'react';

// CSS 모듈 import: 분석 결과 컴포넌트 전용 스타일
import styles from './AnalysisResult.module.css';

// 🔹 컴포넌트 Props 타입 정의
interface Props {
    faceUrls: string[],
    personTimings?: string[] | null
}

// 🔹 얼굴 분석 결과를 보여주는 컴포넌트
const AnalysisResult: React.FC<Props> = ({faceUrls, personTimings}) => {

    return (
        <div className={styles.container}>
            {/* 🔹 얼굴 분석 결과 */}
            <h3 className={styles.title}>🔍 분석된 얼굴</h3>
            <div className={styles.faceGrid}>
                {faceUrls.map((url, idx) => (
                    <img
                        key={idx}
                        src={url}
                        alt={`face-${idx}`}
                        className={styles.faceThumb}
                    />
                ))}
            </div>

            {/* 🔹 사람 등장 시간 표시 */}
            {personTimings && personTimings.length > 0 && (
                <div className={styles.timingSection}>
                    <h3 className={styles.title}>⏱️ 사람 등장 시간</h3>
                    <ul className={styles.timeList}>
                        {personTimings.map((time, idx) => (
                            <li key={idx} className={styles.timeText}>
                                {idx + 1}번 얼굴 : {time}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AnalysisResult;
