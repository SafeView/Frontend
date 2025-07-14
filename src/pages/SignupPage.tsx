import { useState } from 'react';
import styles from './SignupPage.module.css';
import Header from '../components/Header/Header';
import {useNavigate} from "react-router-dom";
import {useUserStore} from "../stores/userStore.ts";

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useUserStore();

    const navigate = useNavigate(); // 🔁 페이지 이동용 훅

    const handleSignup = async () => {
        try {
            await signup(email, password, nickname);
            alert('회원가입 완료!');
            navigate('/');
        } catch (e) {
            alert('회원가입 실패!');
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Sign Up</h1>
                <input
                    className={styles.input}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className={styles.input}
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={styles.button} onClick={handleSignup}>
                    회원가입
                </button>

                {/* 🔽 로그인 페이지 이동 버튼 */}
                <button
                    className={styles.loginButton}
                    onClick={goToLogin}
                    style={{ marginTop: '1rem', backgroundColor: '#2f2f2f' }}
                >
                    이미 회원이신가요? 로그인 하러가기
                </button>
            </div>
        </>
    );
};

export default SignupPage;
