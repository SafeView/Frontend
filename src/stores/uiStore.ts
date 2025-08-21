// src/stores/uiStore.ts
// 📁 UI 관련 상태 관리 (사이드바 열림/닫힘 상태)를 담당하는 zustand 스토어입니다.

import { create } from 'zustand';

/**
 * 📌 UI 상태 타입 정의
 */
interface UIState {
    isSidebarOpen: boolean;     // 사이드바 열림 여부
    toggleSidebar: () => void;  // 사이드바 토글
    closeSidebar: () => void;   // 사이드바 닫기
    openSidebar: () => void;    // 사이드바 열기
}

/**
 * 🧱 zustand 스토어 정의
 */
export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true, // 초기값: 열려있음

    /**
     * 🔁 사이드바 상태를 반전시킵니다.
     */
    toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    /**
     * ❌ 사이드바를 닫습니다.
     */
    closeSidebar: () => set({ isSidebarOpen: false }),

    /**
     * ✅ 사이드바를 엽니다.
     */
    openSidebar: () => set({ isSidebarOpen: true }),
}));
