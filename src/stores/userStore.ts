import { create } from "zustand";
import {
  login as loginService,
  signup as signupService,
} from "../services/authService";

interface UserInfo {
  email: string;
  nickname: string;
  role: "ADMIN" | "POLICE" | "USER";
}

interface UserState {
  user: UserInfo | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: { email: "admin@test.com", nickname: "관리자", role: "ADMIN" },
  token: null,

  login: async (email, password) => {
    const result = await loginService(email, password);
    const role = (result as any).role || "user";
    set({
      token: result.token,
      user: { email: result.email, nickname: result.nickname, role },
    });
  },

  signup: async (email, password, nickname) => {
    const form = {
      email,
      password,
      name: nickname,
      address: "",
      phone: "",
      gender: "",
      birthday: "",
    };
    const result = await signupService(form);
    const role = (result as any).role || "user";
    set({
      token: result.token,
      user: { email: result.email, nickname: result.nickname, role },
    });
  },

  logout: () => {
    set({ user: null, token: null });
  },
}));
