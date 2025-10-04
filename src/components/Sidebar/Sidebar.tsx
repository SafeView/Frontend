import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Camera,
    Video,
    Key,
    Menu,
    X,
    Film,
    Library,
} from 'lucide-react';
import styles from './Sidebar.module.css';

// zustand 상태 가져오기
import { useUIStore } from '../../stores/uiStore';           // 사이드바 열기/닫기 상태
import useUserStore from '../../stores/userStore';

const Sidebar = React.memo(() => {
    const location = useLocation();      // 현재 URL 경로
    const navigate = useNavigate();      // 페이지 이동 함수

    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen); // 열림 여부
    const { closeSidebar, openSidebar } = useUIStore();               // 토글 액션
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);     // 로그인 여부

    // 메뉴 구성
    const menus = [
        { path: '/', label: '홈', icon: <Home size={18} />, authRequired: false },
        { path: '/cameras', label: '카메라', icon: <Camera size={18} />, authRequired: false }, // ✅ 필요 시 true로 변경
        { path: '/analysis', label: '비디오 분석', icon: <Video size={18} />, authRequired: false },
        { path: '/saved', label: '저장된 영상', icon: <Film size={18} />, authRequired: false },
        //{ path: '/reports', label: '통계', icon: <Library size={18} />, authRequired: false },
        { path: '/verification', label: '인증', icon: <Key size={18} />, authRequired: false },
    ];

    // 사이드바 닫기 핸들러
    const handleCloseSidebar = useCallback(() => {
        closeSidebar();
    }, [closeSidebar]);

    // 사이드바 열기 핸들러
    const handleOpenSidebar = useCallback(() => {
        openSidebar();
    }, [openSidebar]);

    // 메뉴 클릭 시 네비게이션 처리
    const handleNavigation = (path: string, authRequired: boolean) => {
        if (authRequired && !isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        navigate(path);
        closeSidebar(); // 메뉴 클릭 후 자동으로 닫기
    };

    return (
        <>
            {/* 📌 열려 있는 사이드바 */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
                <div className={styles.sidebarHeader}>
                    <h3 className={styles.sidebarTitle}>Menu</h3>
                    <button
                        className={styles.closeButton}
                        onClick={handleCloseSidebar}
                        aria-label="사이드바 닫기"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 메뉴 리스트 */}
                <nav className={styles.nav}>
                    {menus.map((menu) => (
                        <button
                            key={menu.path}
                            className={`${styles.link} ${location.pathname === menu.path ? styles.active : ''}`}
                            onClick={() => handleNavigation(menu.path, menu.authRequired)}
                        >
                            <span className={styles.icon}>{menu.icon}</span>
                            {menu.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* 📌 닫힌 사이드바 (오픈 버튼만 보임) */}
            <aside className={`${styles.sidebarClosed} ${!isSidebarOpen ? styles.visible : styles.hidden}`}>
                <button
                    className={styles.openButton}
                    onClick={handleOpenSidebar}
                    aria-label="사이드바 열기"
                >
                    <Menu size={20} />
                </button>
            </aside>
        </>
    );
});

export default Sidebar;
