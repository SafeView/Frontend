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

export const useUserStore = create<UserState>((set) => ({
    user: null,
    token: null,
    isDecrypted: false,
    decryptionKey: '',

    login: async (email, password) => {
        const { token, email: userEmail, nickname } = await loginService(email, password);
        // 임시로 기본 사용자는 USER 권한, admin@example.com은 ADMIN 권한으로 설정
        const role = email === 'admin@example.com' ? 'ADMIN' : 'USER';
        set({ token, user: { email: userEmail, nickname, role } });
    },

    signup: async (email, password, nickname) => {
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
