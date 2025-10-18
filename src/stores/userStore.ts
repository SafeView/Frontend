// src/stores/userStore.ts
// ✅ 사용자 인증, 회원가입, 로그아웃, 토큰 갱신, 복호화 키 관리 등 사용자 관련 상태를 zustand로 관리하는 스토어입니다.

import {create} from 'zustand';
import {
    login as loginService,
    logout as logoutService,
    refreshToken as refreshTokenService,
} from '../services/authService.ts';
import {
    checkEmail,
    getUserInfo,
    sendEmailVerificationCode as sendEmailVerificationCodeService,
    sendTempPassword as sendTempPasswordService,
    signup as signupService,
    updateUserInfo as updateUserInfoService,
    verifyEmailCode as verifyEmailCodeService,
} from '../services/userService.ts';
import type {LoginRequest, SignupRequest, UpdateUserRequest, UserInfo} from "../types/user.ts";

// ✅ 백엔드 없이 테스트할 수 있는 임시 사용자 목록
const TEMP_USERS = [
    { email: 'admin@example.com', password: 'admin123', name: '관리자', role: 'ADMIN' as const },
    { email: 'user@example.com', password: 'user123', name: '일반사용자', role: 'USER' as const },
    { email: 'test@example.com', password: 'test123', name: '테스트사용자', role: 'USER' as const },
];

// ✅ zustand에서 관리할 상태 정의
interface UserState {
    user: UserInfo | null;            // 로그인한 사용자 정보
    isLoggedIn: boolean;              // 로그인 여부
    isDecrypted: boolean;            // 복호화 여부 (토글용)
    decryptionKey: string;           // 복호화 키

    login: (form: LoginRequest) => Promise<void>;         // 로그인
    logout: () => Promise<void>;                          // 로그아웃
    signup: (form: SignupRequest) => Promise<void>;       // 회원가입
    checkEmailDuplication: (email: string) => Promise<boolean>; // 이메일 중복 확인
    fetchUserInfo: () => Promise<void>;                   // 사용자 정보 조회
    refreshToken: () => Promise<void>;                    // 토큰 재발급

    setDecryptionKey: (key: string) => void;              // 복호화 키 저장
    toggleDecryption: () => void;                         // 복호화 토글

    updateUser: (updateData: UpdateUserRequest) => Promise<void>;
    sendTempPassword: (email: string) => Promise<string>;
    sendEmailVerificationCode: (email: string) => Promise<string>;
    verifyEmailCode: (payload: { email: string; code: string }) => Promise<string>;
}

// ✅ zustand 스토어 정의
const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoggedIn: false,
    isDecrypted: false,
    decryptionKey: '',

    /**
     * 🔐 로그인 처리
     * - 로그인 성공 시: 쿠키 저장 + 사용자 정보 조회
     * - 실패 시: TEMP_USERS에서 fallback (백엔드 개발 전용)
     */
    login: async (form) => {
        try {
            await loginService(form); // 로그인 요청 → 쿠키에 저장됨
            const user = await getUserInfo(); // 사용자 정보 조회
            set({ user, isLoggedIn: true });
        } catch (error: any) {
            console.error('✅ 백엔드 로그인 실패, TEMP 유저 fallback 시도 중...');

            // TEMP 유저 fallback (디버깅/로컬 테스트용)
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
     * 📤 로그아웃 처리
     * - 서버에 쿠키 삭제 요청
     * - 클라이언트 상태 초기화
     */
    logout: async () => {
        try {
            await logoutService(); // 서버 쿠키 제거
        } catch (err) {
            console.warn('로그아웃 요청 실패:', err);
        } finally {
            // 상태 초기화
            set({
                user: null,
                isLoggedIn: false,
                isDecrypted: false,
                decryptionKey: '',
            });
        }
    },

    /**
     * 📝 회원가입 처리
     * - 가입 후 자동 로그인
     */
    signup: async (form) => {
        try {
            await signupService(form); // 회원가입 요청
            //자동 로그인
            // await useUserStore.getState().login({
            //     email: form.email,
            //     password: form.password,
            // });
        } catch (err) {
            console.error('회원가입 오류:', err);
            throw err;
        }
    },

    /**
     * 📧 이메일 중복 확인
     * - API 응답 중 available 여부 반환
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
     * 🔄 사용자 정보 조회
     * - 앱 진입 시 세션 유지 확인용
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
     * ♻️ JWT 토큰 재발급
     * - 쿠키 기반 자동 연장
     */
    refreshToken: async () => {
        try {
            const message = await refreshTokenService();
            console.log('🔄 토큰 재발급 성공:', message);
        } catch (err) {
            console.error('🔄 토큰 재발급 실패:', err);
            throw err;
        }
    },

    /**
     * 🧪 복호화 키 설정 (ex. 블록체인 영상용)
     */
    setDecryptionKey: (key: string) => {
        set({ decryptionKey: key });
    },

    /**
     * 🔁 복호화 토글 (ON/OFF)
     */
    toggleDecryption: () => {
        set((state) => ({ isDecrypted: !state.isDecrypted }));
    },


    /**
     * 🛠️ 회원 정보 수정
     * - 수정 성공 시 사용자 정보 갱신
     */
    updateUser: async (updateData) => {
        try {
            const updatedUser = await updateUserInfoService(updateData);
            set({ user: updatedUser });
        } catch (err) {
            console.error('회원 정보 수정 실패:', err);
            throw err;
        }
    },

    /**
     * ✉️ 임시 비밀번호 전송
     */
    sendTempPassword: async (email) => {
        try {
            const message = await sendTempPasswordService(email);
            return message;
        } catch (err) {
            console.error('임시 비밀번호 전송 실패:', err);
            throw err;
        }
    },

    /**
     * 📧 이메일 인증번호 전송
     */
    sendEmailVerificationCode: async (email) => {
        try {
            const message = await sendEmailVerificationCodeService(email);
            return message;
        } catch (err) {
            console.error('이메일 인증번호 전송 실패:', err);
            throw err;
        }
    },

    /**
     * ✅ 이메일 인증번호 검증
     */
    verifyEmailCode: async (payload) => {
        try {
            return await verifyEmailCodeService(payload);
        } catch (err) {
            console.error('이메일 인증번호 검증 실패:', err);
            throw err;
        }
    },
}));

export default useUserStore;
