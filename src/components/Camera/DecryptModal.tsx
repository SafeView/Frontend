import React from 'react';
import styles from './CameraFeed.module.css';

interface DecryptModalProps {
    show: boolean;
    decryptKey: string;
    decryptError?: string;                      // ✅ 변경: 옵셔널, 외부 훅에서 관리
    cameraId: string;
    onClose: () => void;
    onKeyChange: (key: string) => void;
    onSubmit: (cameraId: string) => Promise<void>;
    loading?: boolean;
    onClearError?: () => void;
}

export const DecryptModal: React.FC<DecryptModalProps> = ({
                                                              show,
                                                              decryptKey,
                                                              decryptError,
                                                              cameraId,
                                                              onClose,
                                                              onKeyChange,
                                                              onSubmit,              // ✅ 변경된 설계: keyStore 안 씀, 부모 훅이 WS 검증함
                                                              loading = false,       // ✅ 기본값
                                                              onClearError,          // ✅ 선택
                                                          }) => {
    if (!show) return null;

    // ✅ Enter로 제출
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter' && !loading) {
            onSubmit(cameraId).catch(() => {});
        }
    };

    return (
        <div className={styles.decryptModal} role="dialog" aria-modal="true" aria-labelledby="decrypt-title">
            <div className={styles.decryptModalContent}>
                <h3 id="decrypt-title">복호화키 입력</h3>
                <p>모자이크가 해제된 영상을 보려면 복호화키를 입력하세요.</p>

                {/* ✅ 입력 */}
                <input
                    type="password"
                    value={decryptKey}
                    onChange={(e) => onKeyChange(e.target.value)}
                    placeholder="복호화키를 입력하세요"
                    className={styles.decryptInput}
                    onKeyDown={handleKeyDown}              // ✅ onKeyPress → onKeyDown
                    autoFocus
                    disabled={loading}                      // ✅ 제출 중 비활성화
                />

                {/* ✅ 에러 표시 (외부 훅에서 내려줌) */}
                {decryptError && (
                    <div className={styles.decryptError}>
                        {decryptError}
                        {onClearError && (
                            <button
                                onClick={onClearError}
                                style={{ background: 'none', color: 'red', border: 'none', marginLeft: 8, cursor: 'pointer' }}
                            >
                                닫기
                            </button>
                        )}
                    </div>
                )}

                {/* ✅ 액션 버튼 */}
                <div className={styles.decryptModalButtons}>
                    <button
                        onClick={() => onSubmit(cameraId)}
                        className={styles.submitBtn}
                        disabled={loading || !decryptKey.trim()}  // ✅ 빈 키/로딩 시 비활성화
                    >
                        {loading ? '검증 중...' : '확인'}
                    </button>
                    <button onClick={onClose} className={styles.cancelBtn} disabled={loading}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};
