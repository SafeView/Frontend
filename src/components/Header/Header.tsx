// ✅ React 및 라우팅, 상태 관련 모듈 import
import React, { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

// ✅ Zustand 사용자 및 UI 상태 훅
import useUserStore from "../../stores/userStore.ts";      // 사용자 정보/로그아웃
import { useUIStore } from "../../stores/uiStore.ts";      // 사이드바 상태

// ✅ 알림 아이콘 import (FontAwesome)
// import { FaBell } from "react-icons/fa";

// 🔹 메모이제이션 적용된 Header 컴포넌트 (불필요한 리렌더 방지)
const Header = React.memo(() => {
    // ✅ Zustand에서 필요한 상태만 선택적으로 가져옴
    const user = useUserStore((state) => state.user);                   // 로그인된 사용자 정보
    const performLogout = useUserStore((state) => state.logout);       // 로그아웃 함수
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);  // 사이드바 열림 여부

    // ✅ 라우팅 훅
    const navigate = useNavigate();

    // 🔹 로그아웃 버튼 클릭 시 처리 로직
    const handleLogout = useCallback(async () => {
        try {
            await performLogout();     // 서버 요청 + Zustand 상태 초기화
            navigate("/");            // 로그아웃 후 홈으로 리디렉션
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
        }
    }, [performLogout, navigate]);

    // 🔹 헤더 렌더링 시작
    return (
        <header className={`${styles.header} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
            {/* 왼쪽: 로고 및 타이틀 */}
            <div className={styles.left}>
                {/* 로고 추가 시 아래 주석 해제 */}
                {/* <img src="/logo.svg" className={styles.logo} alt="로고" /> */}
                <span className={styles.title}>Safe - View</span>
            </div>

            {/* 오른쪽: 로그인 상태에 따라 동적 렌더링 */}
            <div className={styles.right}>
                {/* ✅ 로그인 상태 */}
                {user ? (
                    <>
                        {/* 사용자 이름 환영 메시지 */}
                        <span className={styles.welcome}>
                            {user.name} 님 환영합니다!
                        </span>

                        {/*/!* 알림 아이콘 (기능 확장 가능) *!/*/}
                        {/*<button className={styles.iconBtn}>*/}
                        {/*    <FaBell />*/}
                        {/*</button>*/}

                        {/* 로그아웃 버튼 */}
                        <button
                            className={styles.logoutBtn}
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    // ✅ 비로그인 상태 → 로그인 페이지로 이동
                    <button
                        className={styles.loginBtn}
                        onClick={useCallback(() => navigate("/login"), [navigate])}
                    >
                        로그인 하러가기
                    </button>
                )}
            </div>
        </header>
    );
});

export default Header;
