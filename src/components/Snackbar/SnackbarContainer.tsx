import React, { useEffect } from 'react';
import styles from './SnackbarContainer.module.css';
import { useSnackbarStore } from '../../stores/snackbarStore';

/**
 * ✅ SnackbarContainer 컴포넌트
 * - snackbarStore의 큐 상태를 구독하여 사용자에게 메시지를 보여주는 역할
 * - 메시지는 화면에 띄운 뒤 3초 후 자동으로 사라짐
 */
const SnackbarContainer: React.FC = () => {
    // ✅ Zustand store에서 현재 스낵바 큐와 삭제 함수 가져옴
    const { snackbarQueue, removeSnackbar } = useSnackbarStore();

    /**
     * ✅ 스낵바 타이머 로직
     * - 큐에 메시지가 있을 경우 3초 후 가장 첫 번째 메시지를 제거
     * - 큐가 비어 있으면 아무 작업도 하지 않음
     */
    useEffect(() => {
        if (snackbarQueue.length === 0) return;

        const timer = setTimeout(() => {
            removeSnackbar(snackbarQueue[0].id); // 가장 오래된 스낵바 제거
        }, 3000); // 3초 후 자동 제거

        // 컴포넌트 언마운트 시 타이머 클리어
        return () => clearTimeout(timer);
    }, [snackbarQueue]);

    return (
        <div className={styles.container}>
            {/* 현재 큐에 있는 모든 스낵바 메시지 렌더링 */}
            {snackbarQueue.map((snack) => (
                <div
                    key={snack.id} // 고유 ID로 key 설정
                    className={`${styles.snackbar} ${styles[snack.type]}`} // 타입별 스타일 적용
                >
                    {snack.message}
                </div>
            ))}
        </div>
    );
};

export default SnackbarContainer;
