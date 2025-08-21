// src/layouts/HomeLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // 서브 라우트 렌더링용
import Header from '../components/Header/Header'; // 상단 헤더
import Sidebar from '../components/Sidebar/Sidebar'; // 좌측 사이드바
import styles from './HomeLayout.module.css'; // CSS 모듈 스타일
import { useUIStore } from '../stores/uiStore'; // UI 상태 전역 저장소

/**
 * 🏠 HomeLayout 컴포넌트
 * - 전체 레이아웃 구조 정의
 * - 사이드바 + 헤더 + 콘텐츠 영역 포함
 * - react-router의 <Outlet />으로 하위 라우트 출력
 */
const HomeLayout = React.memo(() => {
    // 사이드바 열림 여부 상태 가져오기 (Zustand 전역 상태)
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

    return (
        <div className={styles.layout}>
            {/* ✅ 좌측: 사이드바 */}
            <Sidebar />

            {/* ✅ 우측: 헤더 + 본문 콘텐츠 */}
            <div
                className={`${styles.main} ${
                    isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
                }`}
            >
                {/* 📌 상단 헤더 */}
                <Header />

                {/* 📌 본문 콘텐츠 영역 (라우터 Outlet) */}
                <main className={styles.content}>
                    <Outlet /> {/* 하위 라우트의 실제 컴포넌트 렌더링 */}
                </main>
            </div>
        </div>
    );
});

export default HomeLayout;
