// src/pages/Auth/LoginPage.tsx

import { useState } from 'react';
import styles from './LoginPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../hooks/UserLoginMutation.ts';
import ForgotPasswordModal from "../../components/AuthModal/ForgotPasswordModal.tsx";

/**
 * 🔐 LoginPage 컴포넌트
 * - 이메일 & 비밀번호 기반 로그인 처리
 * - 로그인 요청 시 useLoginMutation 사용
 * - 로그인 성공 시 홈으로 리다이렉트
 * - 회원가입 페이지 이동 버튼 포함
 */
const LoginPage = () => {
    // 🔤 입력된 이메일, 비밀번호 상태
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showResetModal, setShowResetModal] = useState(false); // 비밀번호 찾기 모달 상태


    // 🔁 라우팅 이동을 위한 훅
    const navigate = useNavigate();

    // ✅ 로그인 mutation 훅 사용
    const loginMutation = useLoginMutation();

    /**
     * 🔓 로그인 요청 핸들러
     * - 폼 제출 기본 동작 차단
     * - 유효성 검사 후 로그인 요청
     */
    const handleLogin = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
        }

        // 입력값 검증
        if (!email || !password) {
            alert('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        // 🔄 로그인 API 호출
        loginMutation.mutate({ email, password });
    };

    /**
     * 🧾 회원가입 페이지로 이동
     */
    const goToSignup = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.container}>
            {/* 타이틀 */}
            <h1 className={styles.title}>Login</h1>

            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} className={styles.form}>
                {/* 이메일 입력 필드 */}
                <input
                    className={styles.input}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                />

                {/* 비밀번호 입력 필드 */}
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {/* 로그인 버튼 */}
                <button
                    className={styles.button}
                    type="submit"
                    disabled={loginMutation.isPending} // 요청 중일 때 비활성화
                >
                    {loginMutation.isPending ? '로그인 중...' : '로그인'}
                </button>
            </form>

            {/* 회원가입 이동 버튼 */}
            <button
                className={styles.signupButton}
                onClick={goToSignup}
                style={{ marginTop: '1rem', backgroundColor: '#2f2f2f' }}
            >
                아직 회원이 아니신가요? 회원가입
            </button>

            {/* ✅ 비밀번호 찾기 버튼 */}
            <button
                className={styles.signupButton}
                onClick={() => setShowResetModal(true)}
                style={{ marginTop: '0.5rem', backgroundColor: '#444' }}
            >
                비밀번호를 잊으셨나요? 비밀번호 찾기
            </button>

            {showResetModal && (
                <ForgotPasswordModal onClose={() => setShowResetModal(false)} />
            )}


        </div>


    );
};

export default LoginPage;
