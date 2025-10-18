// src/pages/HomePage.tsx

import { useEffect } from "react";
import SummaryCard from "../components/SummaryCard/SummaryCard"; // 간단한 요약 카드 컴포넌트
//import AlertTable from "../components/AlertTable/AlertTable"; // 경고 리스트 테이블 (현재 주석 처리됨)
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

                {/* 👋 인트로 Hero Section */}
                <motion.div
                    className={styles.hero}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className={styles.title}>👁️‍🗨️ SafeView Dashboard</h1>
                    <p className={styles.subtitle}>
                        AI 기반 CCTV 영상 분석 플랫폼 <br />
                        개인정보 보호와 수사 지원을 동시에!
                    </p>
                </motion.div>

                {/* ✨ 프로젝트 설명 */}
                {/*<motion.div*/}
                {/*    className={styles.projectInfo}*/}
                {/*    initial={{ opacity: 0 }}*/}
                {/*    animate={{ opacity: 1 }}*/}
                {/*    transition={{ delay: 0.5, duration: 1 }}*/}
                {/*>*/}
                {/*    <h3>📌 프로젝트 개요</h3>*/}
                {/*    <p>*/}
                {/*        SafeView는 AI를 활용한 영상 분석 시스템입니다. <br />*/}
                {/*        얼굴과 번호판을 자동으로 탐지 및 모자이크 처리하여, <br />*/}
                {/*        일반 사용자에겐 개인정보 보호를, 공인에겐 복호화 키 기반 원본 제공을 지원합니다.*/}
                {/*    </p>*/}
                {/*    <p>*/}
                {/*        ✅ 주요 기능: 영상 스트리밍, 자동 모자이크, 키 발급/검증, 사용자 권한 관리*/}
                {/*    </p>*/}
                {/*</motion.div>*/}

                {/* 📦 요약 카드 섹션 (총 카메라 수, 활성 경고 수, 시스템 가동률) */}
                {/*<div className={styles.cardRow}>*/}
                {/*    <SummaryCard title="Total Cameras" value={3} />*/}
                {/*    <SummaryCard title="Active Alerts" value={3} />*/}
                {/*    <SummaryCard title="System Uptime" value="87.8%" />*/}
                {/*</div>*/}

                {/*/!* ✅ 테스트 버튼 추가 *!/*/}
                {/*<button*/}
                {/*    className={styles.testButton} // 필요시 스타일 추가*/}
                {/*    onClick={() =>*/}
                {/*        enqueueSnackbar({*/}
                {/*            type: "info",*/}
                {/*            message: "스낵바 음성 테스트",*/}
                {/*        })*/}
                {/*    }*/}
                {/*>*/}
                {/*    스낵바 테스트*/}
                {/*</button>*/}

                {/* 🔔 알림 테이블 (현재 주석 처리됨, 향후 활성화 가능) */}
                {/*<h2 className={styles.sectionTitle}>Live Feeds</h2>*/}
                {/*<AlertTable />*/}
            </div>
        </>
    );
};

export default HomePage;
