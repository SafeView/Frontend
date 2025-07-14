// src/stores/userStore.ts
import { create } from 'zustand';

interface UserState {
    user: { email: string; nickname: string } | null;
    token: string | null;
    setUser: (user: { email: string; nickname: string }, token: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    token: null,
    setUser: (user, token) => set({ user, token }),
    logout: () => set({ user: null, token: null }),
}));
