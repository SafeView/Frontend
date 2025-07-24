// src/stores/userStore.ts
import { create } from 'zustand';
import { login as loginService, signup as signupService } from '../services/authService';

interface UserInfo {
    email: string;
    nickname: string;
    role: 'USER' | 'ADMIN';
}

interface UserState {
    user: UserInfo | null;
    token: string | null;
    isDecrypted: boolean;
    decryptionKey: string;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, nickname: string) => Promise<void>;
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
            set({ token, user: { email: userEmail, nickname, role } });
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
                        role: tempUser.role 
                    } 
                });
            } else {
                throw new Error('잘못된 이메일 또는 비밀번호입니다.');
            }
        }
    },

    signup: async (email, password, nickname) => {
        try {
            // 백엔드 API 호출 시도
            const form = {
                email,
                password,
                name: nickname,
                address: '',
                phone: '',
                gender: '',
                birthday: ''
            };
            const { token, email: userEmail, nickname: nick } = await signupService(form);
            const role = email === 'admin@example.com' ? 'ADMIN' : 'USER';
            set({ token, user: { email: userEmail, nickname: nick, role } });
        } catch (error) {
            // 백엔드 연결 실패 시 임시 회원가입 처리
            console.log('백엔드 연결 실패, 임시 회원가입 처리 중...');
            
            // 이미 존재하는 사용자인지 확인
            const existingUser = TEMP_USERS.find(user => user.email === email);
            if (existingUser) {
                throw new Error('이미 존재하는 이메일입니다.');
            }
            
            // 새 사용자 추가
            TEMP_USERS.push({ email, password, nickname, role: 'USER' });
            const token = `temp_token_${Date.now()}`;
            set({ 
                token, 
                user: { email, nickname, role: 'USER' } 
            });
        }
    },

    logout: () => {
        set({ user: null, token: null, isDecrypted: false, decryptionKey: '' });
    },

    setDecryptionKey: (key: string) => {
        set({ decryptionKey: key });
    },

    toggleDecryption: () => {
        set((state) => ({ isDecrypted: !state.isDecrypted }));
    },
}));
