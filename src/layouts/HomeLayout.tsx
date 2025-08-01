import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import styles from './HomeLayout.module.css'; // CSS 모듈 분리
import { useUIStore } from '../stores/uiStore';

const HomeLayout = React.memo(() => {
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={`${styles.main} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                <Header />
                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
});

export default HomeLayout;
