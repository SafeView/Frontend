import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <img src="/vite.svg" alt="logo" className={styles.logo} />
                <span className={styles.title}>Safe - View</span>
            </div>

            <nav className={styles.nav}>
                <Link to="/">Dashboard</Link>
                <Link to="/cameras">Cameras</Link>
                <Link to="/alerts">Alerts</Link>
                <Link to="/settings">Settings</Link>
            </nav>

            <div className={styles.right}>
                <button className={styles.iconBtn}>🔔</button>
                <Link to="/login">
                    <img
                        src="/assets/defaultProfile.png" // Placeholder profile image
                        alt="profile"
                        className={styles.profile}
                    />
                </Link>
            </div>
        </header>
    );
};

export default Header;
