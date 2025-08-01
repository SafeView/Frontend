// src/stores/userStore.ts
import { create } from 'zustand';
import { login as loginService, signup as signupService } from '../services/authService';
import { signup as userSignup, checkEmailDuplication } from '../apis/userApi';
import { login as authLogin } from '../apis/auth';
import { TokenStorage } from '../utils/tokenStorage';
interface UserInfo {
    email: string;
    nickname: string;
    name: string;
    role: 'USER' | 'ADMIN';
}

interface UserState {
    user: UserInfo | null;
    token: string | null;
    isDecrypted: boolean;
    decryptionKey: string;
    login: (email: string, password: string) => Promise<void>;
    setUserData: (user: UserInfo, token: string) => void;
    signup: (email: string, password: string, nickname: string, address?: string, phone?: string, gender?: string, birthday?: string) => Promise<void>;
    checkEmail: (email: string) => Promise<boolean>;
    logout: () => void;
    setDecryptionKey: (key: string) => void;
    toggleDecryption: () => void;
}

// 임시 사용자 데이터 (백엔드 없이 테스트용)
const TEMP_USERS = [
    { email: 'admin@example.com', password: 'admin123', nickname: '관리자', role: 'ADMIN' as const },
    { email: 'user@example.com', password: 'user123', nickname: '일반사용자', role: 'USER' as const },
    { email: 'test@example.com', password: 'test123', nickname: '테스트사용자', role: 'USER' as const }
];

export const useUserStore = create<UserState>((set) => ({
    user: null,
    token: null,
    isDecrypted: false,
    decryptionKey: '',

    login: async (email, password) => {
        try {
            // 백엔드 API 호출 시도
            const { token, email: userEmail, nickname } = await loginService(email, password);
            const role = email === 'admin@example.com' ? 'ADMIN' : 'USER';
            set({ token, user: { email: userEmail, nickname, name: nickname, role } });
        } catch (error) {
            // 백엔드 연결 실패 시 임시 로그인 처리
            console.log('백엔드 연결 실패, 임시 로그인 처리 중...');
            
            const tempUser = TEMP_USERS.find(user => 
                user.email === email && user.password === password
            );
            
            if (tempUser) {
                const token = `temp_token_${Date.now()}`;
                set({ 
                    token, 
                    user: { 
                        email: tempUser.email, 
                        nickname: tempUser.nickname, 
                        name: tempUser.nickname,
                        role: tempUser.role 
                    } 
                });
            } else {
                throw new Error('잘못된 이메일 또는 비밀번호입니다.');
            }
        }
    },

    setUserData: (user: UserInfo, token: string) => {
        set({ user, token });
    },

    signup: async (email, password, nickname, address = '', phone = '', gender = '', birthday = '') => {
        try {
            // 실제 API 호출
            const userData = {
                email,
                password,
                name: nickname,
                address,
                phone,
                gender,
                birthday
            };
            const response = await userSignup(userData);
            console.log('회원가입 성공:', response);
            
            // 회원가입 성공 후 자동 로그인 처리
            const loginResponse = await authLogin({ email, password });
            
            // 토큰을 쿠키에 저장
            TokenStorage.setAccessToken(loginResponse.token);
            
            set({ 
                token: loginResponse.token, 
                user: { 
                    email: loginResponse.email, 
                    nickname: loginResponse.name, 
                    name: loginResponse.name,
                    role: 'USER' // 기본값으로 USER 설정
                } 
            });
        } catch (error) {
            console.error('회원가입 실패:', error);
            throw error;
        }
    },

    checkEmail: async (email: string) => {
        try {
            const isAvailable = await checkEmailDuplication(email);
            return isAvailable;
        } catch (error) {
            console.error('이메일 중복 체크 실패:', error);
            throw error;
        }
    },

    logout: () => {
        // 쿠키에서 토큰 삭제
        TokenStorage.clearTokens();
        set({ user: null, token: null, isDecrypted: false, decryptionKey: '' });
    },

    setDecryptionKey: (key: string) => {
        set({ decryptionKey: key });
    },

    toggleDecryption: () => {
        set((state) => ({ isDecrypted: !state.isDecrypted }));
    },
}));
