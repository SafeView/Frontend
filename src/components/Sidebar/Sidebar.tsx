// src/components/Sidebar/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCamera, FaBell, FaChartBar, FaCog } from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const location = useLocation();

    const menus = [
        { path: '/', label: 'Overview', icon: <FaHome /> },
        { path: '/cameras', label: 'Cameras', icon: <FaCamera /> },
        { path: '/alerts', label: 'Alerts', icon: <FaBell /> },
        { path: '/reports', label: 'Reports', icon: <FaChartBar /> },
        { path: '/settings', label: 'Settings', icon: <FaCog /> },
    ];

    return (
        <aside className={styles.sidebar}>
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
        </aside>
    );
};

export default Sidebar;
