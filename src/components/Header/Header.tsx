import {Link, useNavigate} from 'react-router-dom';
import styles from './Header.module.css';
import {useUserStore} from "../../stores/userStore.ts";

const Header = () => {
    const { user, logout } = useUserStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // 상태 초기화
        navigate('/'); // 홈으로 이동
    };


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
                {/* ✅ 로그인 상태일 때 */}
                {user ? (
                    <>
                        <span className={styles.welcome}>{user.nickname} 님 환영합니다!</span>
                        <button className={styles.iconBtn}>🔔</button>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={styles.loginBtn}
                            onClick={() => navigate('/login')}
                        >
                            로그인 하러가기
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
