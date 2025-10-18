// src/pages/HomePage.tsx

import { useEffect } from "react";
import { useAlertStore } from "../stores/alertStore"; // zustand 기반 알림 스토어
import styles from "./HomePage.module.css";
import {useSnackbarStore} from "../stores/snackbarStore.ts"; // CSS 모듈 스타일링
import { motion } from "framer-motion";

/**
 * 📊 HomePage 컴포넌트
 * - 대시보드 형태의 메인 페이지
 * - SummaryCard로 시스템 상태를 요약해서 보여줌
 * - AlertTable은 향후 활성화 가능
 */
const HomePage = () => {

    // ✅ 스낵바 스토어 사용
    const { enqueueSnackbar } = useSnackbarStore();

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

                {/* 👁️ Hero Section */}
                <motion.div
                    className={styles.hero}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className={styles.title}>👁️‍🗨️ SafeView</h1>
                    <p className={styles.subtitle}>
                        AI 기반 CCTV 영상 분석 플랫폼 <br />
                        개인정보 보호와 수사 지원을 동시에!
                    </p>
                </motion.div>

                {/* 📌 서비스 소개 섹션 */}
                <motion.div
                    className={styles.section}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h2>SafeView란?</h2>
                    <p>
                        SafeView는 영상 속 민감 정보를 보호하면서,
                        <br /> 법적 증거로 활용 가능한 <strong>AI 기반 CCTV 분석 시스템</strong>입니다.
                        <br />
                        얼굴 자동 모자이크 + 블록체인 기반 키 관리 시스템 제공
                    </p>
                </motion.div>

                {/* 🧩 주요 기능 섹션 */}
                <motion.div
                    className={styles.section}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h2>주요 기능</h2>
                    <ul className={styles.featureList}>
                        <li>AI 기반 얼굴 탐지 및 자동 모자이크</li>
                        <li>사용자별 영상 조회 권한 구분</li>
                        <li>복호화 키 발급 및 검증 (블록체인 연동)</li>
                        <li>WebSocket 기반 실시간 영상 스트리밍</li>
                        <li>영상 다운로드 및 이력 관리</li>
                    </ul>
                </motion.div>

                {/* 🔁 사용 흐름 섹션 */}
                <motion.div
                    className={styles.section}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h2>사용 흐름</h2>
                    <ol className={styles.flowList}>
                        <li>CCTV 영상 자동 업로드</li>
                        <li>AI가 자동 탐지 및 모자이크 처리</li>
                        <li>일반 사용자: 모자이크 영상 열람</li>
                        <li>공인 사용자: 키 인증 후 원본 열람</li>
                    </ol>
                </motion.div>

                {/* 🚀 CTA(Call to Action) */}
                <motion.div
                    className={styles.section}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h2>🚀 지금 시작해보세요</h2>
                    <p>로그인 후 대시보드에서 영상을 분석하고, 권한을 요청할 수 있습니다.</p>

                </motion.div>
            </div>
        </>
    );
};

export default HomePage;
