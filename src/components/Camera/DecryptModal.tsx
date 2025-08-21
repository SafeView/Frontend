// React 및 스타일 모듈 import
import React from 'react';
import styles from './CameraFeed.module.css';

// 🔹 컴포넌트 Props 타입 정의
interface DecryptModalProps {
    show: boolean;                              // 모달 표시 여부
    decryptKey: string;                         // 현재 입력 중인 복호화 키
    decryptError?: string;                      // 오류 메시지 (옵셔널, 외부 훅에서 관리)
    cameraId: string;                           // 복호화 대상 카메라 ID
    onClose: () => void;                        // 모달 닫기 핸들러
    onKeyChange: (key: string) => void;         // 키 입력 변경 핸들러
    onSubmit: (cameraId: string) => Promise<void>; // 키 제출 및 검증 로직
    loading?: boolean;                          // 로딩 중 여부 (기본값 false)
    onClearError?: () => void;                  // 오류 닫기 버튼 핸들러 (옵션)
}

// 🔹 DecryptModal 컴포넌트 정의
export const DecryptModal: React.FC<DecryptModalProps> = ({
                                                              show,
                                                              decryptKey,
                                                              decryptError,
                                                              cameraId,
                                                              onClose,
                                                              onKeyChange,
                                                              onSubmit,
                                                              loading = false,
                                                              onClearError,
                                                          }) => {
    // 모달 표시 안하면 null 반환
    if (!show) return null;

    // 🔸 Enter 키로 제출 가능하게 처리
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter' && !loading) {
            onSubmit(cameraId).catch(() => {}); // 예외 무시
        }
    };

    return (
        <div
            className={styles.decryptModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="decrypt-title"
        >
            <div className={styles.decryptModalContent}>
                <h3 id="decrypt-title">복호화키 입력</h3>
                <p>모자이크가 해제된 영상을 보려면 복호화키를 입력하세요.</p>

                {/* 🔸 복호화 키 입력창 */}
                <input
                    type="password"
                    value={decryptKey}
                    onChange={(e) => onKeyChange(e.target.value)}         // 상태 변경
                    placeholder="복호화키를 입력하세요"
                    className={styles.decryptInput}
                    onKeyDown={handleKeyDown}                              // Enter 키 입력 처리
                    autoFocus
                    disabled={loading}                                     // 로딩 중일 때 입력 비활성화
                />

                {/* 🔸 에러 메시지 출력 영역 */}
                {decryptError && (
                    <div className={styles.decryptError}>
                        {decryptError}
                        {/* 닫기 버튼이 있는 경우만 출력 */}
                        {onClearError && (
                            <button
                                onClick={onClearError}
                                style={{
                                    background: 'none',
                                    color: 'red',
                                    border: 'none',
                                    marginLeft: 8,
                                    cursor: 'pointer',
                                }}
                            >
                                닫기
                            </button>
                        )}
                    </div>
                )}

                {/* 🔸 제출 및 취소 버튼 영역 */}
                <div className={styles.decryptModalButtons}>
                    {/* 확인 (복호화 키 제출) */}
                    <button
                        onClick={() => onSubmit(cameraId)}                 // 비동기 제출 요청
                        className={styles.submitBtn}
                        disabled={loading || !decryptKey.trim()}          // 입력이 없거나 로딩 중이면 비활성화
                    >
                        {loading ? '검증 중...' : '확인'}
                    </button>

                    {/* 취소 (모달 닫기) */}
                    <button
                        onClick={onClose}
                        className={styles.cancelBtn}
                        disabled={loading}                                 // 로딩 중에는 취소도 잠시 비활성화
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};
