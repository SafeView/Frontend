// 📷 카메라 초기화 및 권한 상태를 zustand로 관리하는 스토어입니다.
// 카메라 스트리밍 및 영상 분석 기능 사용 전 필요한 상태를 설정하고 추적합니다.

import { create } from 'zustand';

// 🧠 상태 인터페이스 정의
interface CameraState {
    isInitialized: boolean;                    // ✅ 카메라가 초기화 되었는지 여부
    hasPermission: boolean;                    // ✅ 카메라 접근 권한이 있는지 여부

    setIsInitialized: (initialized: boolean) => void; // 카메라 초기화 상태 설정
    setHasPermission: (permission: boolean) => void;  // 권한 상태 설정
    reset: () => void;                                // 모든 상태 초기화
}

// ✅ zustand 스토어 정의
export const useCameraStore = create<CameraState>((set) => ({
    isInitialized: false,  // 초기 상태: 카메라 초기화 안됨
    hasPermission: false,  // 초기 상태: 권한 없음

    /**
     * 카메라 초기화 상태를 설정합니다.
     * @param initialized - 초기화 여부 (true/false)
     */
    setIsInitialized: (initialized) => set({ isInitialized: initialized }),

    /**
     * 카메라 권한 상태를 설정합니다.
     * @param permission - 권한 여부 (true/false)
     */
    setHasPermission: (permission) => set({ hasPermission: permission }),

    /**
     * 카메라 관련 상태를 초기화합니다.
     */
    reset: () => set({ isInitialized: false, hasPermission: false }),
}));
