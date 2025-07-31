// src/components/Sidebar/Sidebar.tsx
import React, { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCamera, FaBell, FaChartBar, FaCog, FaTimes, FaBars } from 'react-icons/fa';
import styles from './Sidebar.module.css';
import { useUIStore } from '../../stores/uiStore';

const Sidebar = React.memo(() => {
    const location = useLocation();
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const { closeSidebar, openSidebar } = useUIStore();

    const menus = [
        { path: '/', label: 'Overview', icon: <FaHome /> },
        { path: '/cameras', label: 'Cameras', icon: <FaCamera /> },
        { path: '/alerts', label: 'Alerts', icon: <FaBell /> },
        { path: '/reports', label: 'Reports', icon: <FaChartBar /> },
        { path: '/settings', label: 'Settings', icon: <FaCog /> },
    ];

    const handleCloseSidebar = useCallback(() => {
        closeSidebar();
    }, [closeSidebar]);

    const handleOpenSidebar = useCallback(() => {
        openSidebar();
    }, [openSidebar]);

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
                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`${styles.link} ${location.pathname === menu.path ? styles.active : ''}`}
                        >
                            <span className={styles.icon}>{menu.icon}</span>
                            {menu.label}
                        </Link>
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
