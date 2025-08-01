import { useState } from 'react';
import styles from './LoginPage.module.css';
import {useNavigate} from "react-router-dom";
import {useLoginMutation} from "../../hooks/UserLoginMutation.ts";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // 로그인 뮤테이션 훅 사용
    const loginMutation = useLoginMutation();

    const handleLogin = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        
        if (!email || !password) {
            alert('이메일과 비밀번호를 입력해주세요.');
            return;
        }
        
        // 뮤테이션 실행
        loginMutation.mutate({ email, password });
    };

    const goToSignup = () => {
        navigate('/signup'); // 🔁 회원가입 페이지로 이동
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={handleLogin} className={styles.form}>
                <input
                    className={styles.input}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button 
                    className={styles.button} 
                    type="submit"
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? '로그인 중...' : '로그인'}
                </button>
            </form>
            <button
                className={styles.signupButton}
                onClick={goToSignup}
                style={{ marginTop: '1rem', backgroundColor: '#2f2f2f' }}
            >
                아직 회원이 아니신가요? 회원가입
            </button>
        </div>
    );
};

export default LoginPage;
