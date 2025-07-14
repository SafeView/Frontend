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
        const data = await loginService(email, password);
        const { token, user } = data;
        set({ token, user });
    },

    signup: async (email, password, nickname) => {
        const data = await signupService(email, password, nickname);
        const { token, user } = data;
        set({ token, user });
    },

    logout: () => {
        set({ user: null, token: null });
    },
}));
