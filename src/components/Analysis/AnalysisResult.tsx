// React 핵심 라이브러리 import
import React from 'react';

// CSS 모듈 import: 분석 결과 컴포넌트 전용 스타일
import styles from './AnalysisResult.module.css';

// 🔹 컴포넌트 Props 타입 정의
interface Props {
    faceUrls: string[]; // 분석된 얼굴 이미지의 URL 배열
}

// (주석 처리된 인터페이스는 추후 기능 확장을 위한 주석으로 추정됨)
// interface AnalysisHistoryItemData {
//     filename: string;         // 분석된 영상 파일 이름
//     timestamp: string;        // 분석 시각
//     objectsDetected: number;  // 감지된 객체 수 (ex. 얼굴 수)
// }

// 🔹 얼굴 분석 결과를 보여주는 컴포넌트
const AnalysisResult: React.FC<Props> = ({ faceUrls }) => {

    return (
        <div className={styles.container}>
            {/* 섹션 제목 */}
            <h3 className={styles.title}>🔍 분석된 얼굴</h3>

            {/* 분석된 얼굴들을 그리드 형식으로 나열 */}
            <div className={styles.faceGrid}>
                {/* 얼굴 이미지 URL 배열을 map으로 렌더링 */}
                {faceUrls.map((url, idx) => (
                    <img
                        key={idx}                       // 각 이미지 고유 key
                        src={url}                       // 이미지 URL
                        alt={`face-${idx}`}             // 접근성 및 SEO용 alt 텍스트
                        className={styles.faceThumb}    // 썸네일 스타일 클래스 적용
                    />
                ))}
            </div>
        </div>
    );
};

// 외부에서 사용 가능하도록 export
export default AnalysisResult;
