// src/stores/userStore.ts

import { create } from 'zustand';
import {
    login as loginService,
    getUserInfo,
    logout as logoutService, // 💡 로그아웃 API import
    refreshToken as refreshTokenService,
} from '../services/authService.ts';
import {
    signup as signupService,
    checkEmail,
} from '../services/userService.ts';
import type { LoginRequest, SignupRequest, UserInfo } from "../types/user.ts";

// 임시 사용자 데이터 (백엔드 없이 테스트용)
const TEMP_USERS = [
    { email: 'admin@example.com', password: 'admin123', name: '관리자', role: 'ADMIN' as const },
    { email: 'user@example.com', password: 'user123', name: '일반사용자', role: 'USER' as const },
    { email: 'test@example.com', password: 'test123', name: '테스트사용자', role: 'USER' as const },
];


interface UserState {
    user: UserInfo | null;
    isLoggedIn: boolean;
    isDecrypted: boolean;
    decryptionKey: string;

    login: (form: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    signup: (form: SignupRequest) => Promise<void>;
    checkEmailDuplication: (email: string) => Promise<boolean>;
    fetchUserInfo: () => Promise<void>;
    refreshToken: () => Promise<void>;


    setDecryptionKey: (key: string) => void;
    toggleDecryption: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoggedIn: false,
    isDecrypted: false,
    decryptionKey: '',

    /**
     * 🔐 로그인
     * - 성공 시: JWT는 HttpOnly 쿠키로 저장되며, 응답 본문에 토큰 없음
     * - 이후 getUserInfo()를 통해 사용자 정보 조회
     * - 실패 시: TEMP 유저 fallback (개발 중 디버깅 용도)
     */
    login: async (form) => {
        try {
            await loginService(form); // 쿠키에 저장
            const user = await getUserInfo(); // 로그인 성공 시 유저 정보 요청
            set({ user, isLoggedIn: true });
        } catch (error: any) {
            console.error('✅ 백엔드 로그인 실패, TEMP 유저 fallback 시도 중...');

            // TEMP 유저로 fallback (백엔드 없을 때 테스트용)
            const found = TEMP_USERS.find(u => u.email === form.email && u.password === form.password);
            if (found) {
                set({
                    user: {
                        email: found.email,
                        name: found.name,
                        role: found.role,
                    },
                    isLoggedIn: true,
                });
            } else {
                throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
            }
        }
    },

    /**
     * 📤 로그아웃
     * - 서버 로그아웃 API 호출 및 상태 초기화
     */
    logout: async () => {
        try {
            await logoutService(); // 💡 서버에 쿠키 삭제 요청
        } catch (err) {
            console.warn('로그아웃 요청 실패:', err);
        } finally {
            // 클라이언트 상태 초기화
            set({
                user: null,
                isLoggedIn: false,
                isDecrypted: false,
                decryptionKey: '',
            });
        }
    },

    /**
     * 📝 회원가입
     * - 성공 시: 자동 로그인 처리
     */
    signup: async (form) => {
        try {
            await signupService(form);
            // 자동 로그인 처리
            await useUserStore.getState().login({
                email: form.email,
                password: form.password,
            });
        } catch (err) {
            console.error('회원가입 오류:', err);
            throw err;
        }
    },

    /**
     * 📧 이메일 중복 확인
     * - 반환값: 사용 가능 여부 (boolean)
     * - API 응답의 available 값을 추출
     */
    checkEmailDuplication: async (email: string) => {
        try {
            const response = await checkEmail(email);
            return response.available;
        } catch (error: any) {
            console.error('❌ 이메일 중복 확인 실패:', error.message);
            throw error;
        }
    },

    /**
     * 🔄 앱 진입 시 사용자 정보 재요청
     * - 쿠키 기반 세션 유지 시 호출
     */
    fetchUserInfo: async () => {
        try {
            const user = await getUserInfo();
            set({ user, isLoggedIn: true });
        } catch (err) {
            console.error('사용자 정보 불러오기 실패:', err);
            set({ user: null, isLoggedIn: false });
        }
    },

    /**
     * 🔄 토큰 재발급 요청
     */
    refreshToken: async () => {
        try {
            const message = await refreshTokenService(); // 💡 메시지 반환됨
            console.log('🔄 토큰 재발급 성공:', message);
        } catch (err) {
            console.error('🔄 토큰 재발급 실패:', err);
            throw err;
        }
    },

    /**
     * 🔐 블록체인 복호화 키 설정
     */
    setDecryptionKey: (key: string) => {
        set({ decryptionKey: key });
    },

    /**
     * 🔁 블록체인 복호화 여부 토글
     */
    toggleDecryption: () => {
        set((state) => ({ isDecrypted: !state.isDecrypted }));
    },
}));

export default useUserStore;


