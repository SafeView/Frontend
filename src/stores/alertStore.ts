// 🚨 Alert(경고/침입 알림) 상태를 zustand로 관리하는 스토어입니다.
// 실제 백엔드 연동 전, 더미 데이터를 기반으로 알림 목록을 제공합니다.

import { create } from 'zustand';
import type { Alert } from '../types/alert';

// 🔔 Alert 상태 정의
interface AlertStore {
    alerts: Alert[];             // 전체 알림 목록
    fetchAlerts: () => void;     // 알림 목록 불러오기 함수 (현재는 더미로 대체됨)
}

// ✅ zustand 스토어 생성
export const useAlertStore = create<AlertStore>((set) => ({
    alerts: [],

    /**
     * 알림 데이터를 불러옵니다.
     * - 현재는 백엔드 연동 없이 더미(static) 데이터를 사용합니다.
     * - 향후 API 연동 시 이 함수 내부에서 fetch 또는 axios 요청으로 대체합니다.
     */
    fetchAlerts: () =>
        set({
            alerts: [
                {
                    timestamp: '2024-01-20 14:30',           // 발생 시간
                    camera: 'Entrance 1',                    // 발생 카메라 위치
                    type: 'Intrusion',                       // 알림 타입
                    description: 'Person detected in restricted area', // 상세 설명
                },
                {
                    timestamp: '2024-01-20 13:15',
                    camera: 'Parking Lot',
                    type: 'Suspicious Activity',
                    description: 'Unusual vehicle movement',
                },
            ],
        }),
}));
