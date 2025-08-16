import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome, FaCamera, FaChartBar, FaTimes, FaBars, FaFileVideo, FaKey
} from 'react-icons/fa';
import styles from './Sidebar.module.css';
import { useUIStore } from '../../stores/uiStore';
import useUserStore from '../../stores/userStore';

const Sidebar = React.memo(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const { closeSidebar, openSidebar } = useUIStore();
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);

    const menus = [
        { path: '/', label: 'Overview', icon: <FaHome />, authRequired: false },
        { path: '/cameras', label: 'Cameras', icon: <FaCamera />, authRequired: false }, //true로 바꾸기
        { path: '/analysis', label: 'Video Analysis', icon: <FaFileVideo />, authRequired: false },
        { path: '/reports', label: 'Reports', icon: <FaChartBar />, authRequired: false },
        //{ path: '/settings', label: 'Settings', icon: <FaCog />, authRequired: false },
        { path: '/verification', label: 'Verification', icon: <FaKey />, authRequired: false },
    ];

    const handleCloseSidebar = useCallback(() => {
        closeSidebar();
    }, [closeSidebar]);

    const handleOpenSidebar = useCallback(() => {
        openSidebar();
    }, [openSidebar]);

    const handleNavigation = (path: string, authRequired: boolean) => {
        if (authRequired && !isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        navigate(path);
        closeSidebar();
    };

    return (
        <>
            {/* 열린 사이드바 */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
                <div className={styles.sidebarHeader}>
                    <h3 className={styles.sidebarTitle}>Menu</h3>
                    <button
                        className={styles.closeButton}
                        onClick={handleCloseSidebar}
                        aria-label="사이드바 닫기"
                    >
                        <FaTimes />
                    </button>
                </div>

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

            {/* 닫힌 사이드바 - 열기 버튼만 표시 */}
            <aside className={`${styles.sidebarClosed} ${!isSidebarOpen ? styles.visible : styles.hidden}`}>
                <button
                    className={styles.openButton}
                    onClick={handleOpenSidebar}
                    aria-label="사이드바 열기"
                >
                    <FaBars />
                </button>
            </aside>
        </>
    );
});

export default Sidebar;
