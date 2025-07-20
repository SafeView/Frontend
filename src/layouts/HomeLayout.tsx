import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import styles from './HomeLayout.module.css'; // CSS 모듈 분리

const HomeLayout: React.FC = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.main}>
                <Header />
                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default HomeLayout;
