import { useState } from 'react';
import styles from './LoginPage.module.css';
import Header from '../components/Header/Header';
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        console.log('로그인 시도:', { email, password });
        // TODO: axios.post('/api/auth/login') 연결 예정
    };

    const goToSignup = () => {
        navigate('/signup'); // 🔁 회원가입 페이지로 이동
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>Login</h1>
                <input
                    className={styles.input}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={styles.button} onClick={handleLogin}>
                    로그인
                </button>
                {/* 🔽 회원가입 버튼 추가 */}
                <button
                    className={styles.signupButton}
                    onClick={goToSignup}
                    style={{ marginTop: '1rem', backgroundColor: '#2f2f2f' }}
                >
                    아직 회원이 아니신가요? 회원가입
                </button>
            </div>
        </>
    );
};

export default LoginPage;
