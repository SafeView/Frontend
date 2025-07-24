import {useNavigate} from "react-router-dom";
import styles from "./Header.module.css";
import {useUserStore} from "../../stores/userStore.ts";
import {FaBell} from "react-icons/fa";


const Header = () => {
    const {user, logout} = useUserStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // 상태 초기화
        navigate("/"); // 홈으로 이동
    };

    return (
        <header className={styles.header}>
            {/* ✅ 왼쪽: 로고 및 타이틀 */}
            <div className={styles.left}>
                {/* 🔒 로고 넣고 싶으면 여기에 <img src="/logo.svg" className={styles.logo} /> 추가 */}
                <span className={styles.title}>Safe - View</span>
            </div>


            {/* ✅ 오른쪽: 로그인/로그아웃/알림 */}
            <div className={styles.right}>
                {user ? (
                    <>
            <span className={styles.welcome}>
              {user.nickname} 님 환영합니다!
            </span>
                        <button className={styles.iconBtn}>
                            <FaBell/>
                        </button>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <button
                        className={styles.loginBtn}
                        onClick={() => navigate("/login")}
                    >
                        로그인 하러가기
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
