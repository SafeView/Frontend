// src/pages/HomePage.tsx

import { useEffect } from "react";
import SummaryCard from "../components/SummaryCard/SummaryCard"; // 간단한 요약 카드 컴포넌트
// @ts-ignore
import AlertTable from "../components/AlertTable/AlertTable"; // 경고 리스트 테이블 (현재 주석 처리됨)
import { useAlertStore } from "../stores/alertStore"; // zustand 기반 알림 스토어
import styles from "./HomePage.module.css"; // CSS 모듈 스타일링

/**
 * 📊 HomePage 컴포넌트
 * - 대시보드 형태의 메인 페이지
 * - SummaryCard로 시스템 상태를 요약해서 보여줌
 * - AlertTable은 향후 활성화 가능
 */
const HomePage = () => {
    // zustand에서 알림 데이터를 불러오는 메서드
    const { fetchAlerts } = useAlertStore();

    // 컴포넌트 마운트 시 알림 데이터 불러오기
    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <>
            <div className={styles.container}>
                {/* 🏷️ 대시보드 헤더 */}
                <h1 className={styles.heading}>Overview</h1>

                {/* 📦 요약 카드 섹션 (총 카메라 수, 활성 경고 수, 시스템 가동률) */}
                <div className={styles.cardRow}>
                    <SummaryCard title="Total Cameras" value={3} />
                    <SummaryCard title="Active Alerts" value={3} />
                    <SummaryCard title="System Uptime" value="87.8%" />
                </div>

                {/* 🔔 알림 테이블 (현재 주석 처리됨, 향후 활성화 가능) */}
                {/*<h2 className={styles.sectionTitle}>Live Feeds</h2>*/}
                {/*<AlertTable />*/}
            </div>
        </>
    );
};

export default HomePage;
