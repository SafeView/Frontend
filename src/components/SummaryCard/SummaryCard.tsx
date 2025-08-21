import React from "react";
import styles from "./SummaryCard.module.css";

/**
 * ✅ SummaryCardProps 인터페이스
 * - 각 카드에 들어갈 데이터 타입 정의
 * - title: 카드의 제목 (예: 총 사용자 수)
 * - value: 해당 값 (숫자 또는 문자열)
 */
interface SummaryCardProps {
    title: string;
    value: string | number;
}

/**
 * ✅ SummaryCard 컴포넌트
 * - props로 전달된 title과 value를 표시하는 카드 컴포넌트
 * - 주로 대시보드에서 통계 요약을 표현하는 데 사용됨
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => (
    <div className={styles.card}>
        {/* 제목 */}
        <p className={styles.title}>{title}</p>

        {/* 값 */}
        <h2 className={styles.value}>{value}</h2>
    </div>
);

export default SummaryCard;
