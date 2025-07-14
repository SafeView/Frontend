// src/stores/userStore.ts
import { create } from 'zustand';
import { login as loginService, signup as signupService } from '../services/authService';

interface UserInfo {
    email: string;
    nickname: string;
}

interface UserState {
    user: UserInfo | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, nickname: string) => Promise<void>;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    token: null,


    login: async (email, password) => {
        const { token, email: userEmail, nickname } = await loginService(email, password);
        set({ token, user: { email: userEmail, nickname } });
    },

    signup: async (email, password, nickname) => {
        const { token, email: userEmail, nickname: nick } = await signupService(email, password, nickname);
        set({ token, user: { email: userEmail, nickname: nick } });
    },

    logout: () => {
        set({ user: null, token: null });
    },
}));
