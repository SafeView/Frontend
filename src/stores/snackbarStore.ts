// src/stores/snackbarStore.ts
// 📢 전역 스낵바(알림 메시지) 큐를 관리하는 zustand 스토어입니다.
// - enqueueSnackbar: 메시지를 추가
// - removeSnackbar: 특정 메시지를 제거
// - clearAll: 모든 메시지를 제거

import { create } from 'zustand';

/**
 * 📌 스낵바 메시지 타입 정의
 */
export type SnackbarMessage = {
    id: number;                     // 고유 식별자
    message: string;               // 표시할 메시지
    type: 'info' | 'success' | 'error'; // 메시지 타입 (색상/아이콘 구분용)
};

/**
 * 🧠 스낵바 상태 정의
 */
interface SnackbarState {
    snackbarQueue: SnackbarMessage[];                           // 현재 활성화된 메시지 큐
    enqueueSnackbar: (msg: Omit<SnackbarMessage, 'id'>) => void; // 새 메시지 추가
    removeSnackbar: (id: number) => void;                        // 특정 메시지 제거
    clearAll: () => void;                                        // 전체 메시지 초기화
}

let snackbarId = 0; // 고유 ID 증가값 (전역 유지)


/**
 * 🔊 텍스트 음성 출력 함수 (Web Speech API)
 */
const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR'; // 한국어
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
};


/**
 * 🧱 zustand 스토어 정의
 */
export const useSnackbarStore = create<SnackbarState>((set) => ({
    snackbarQueue: [],

    /**
     * 🔔 스낵바 메시지를 큐에 추가합니다.
     * @param msg 메시지 내용 및 타입 (id는 내부에서 자동 부여)
     */
    enqueueSnackbar: (msg) =>
        set((state) => {
            const messageWithId = { ...msg, id: snackbarId++ };

            // 🔊 음성 출력
            speak(msg.message);

            return {
                snackbarQueue: [...state.snackbarQueue, messageWithId]
            };
        }),

    /**
     * ❌ 특정 스낵바 메시지를 큐에서 제거합니다.
     * @param id 제거할 메시지 ID
     */
    removeSnackbar: (id) =>
        set((state) => ({
            snackbarQueue: state.snackbarQueue.filter((m) => m.id !== id)
        })),

    /**
     * 🧼 전체 스낵바 메시지를 초기화합니다.
     */
    clearAll: () => set({ snackbarQueue: [] }),
}));
