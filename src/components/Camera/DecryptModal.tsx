import React from 'react';
import styles from './CameraFeed.module.css';
import useKeyStore from '../../stores/keyStore'; // ✅ 추가된 부분 (키 검증 스토어)
import { useState } from 'react';

interface DecryptModalProps {
  show: boolean;
  decryptKey: string;
  decryptError: string;
    cameraId: string;
  onClose: () => void;
  onKeyChange: (key: string) => void;
}

export const DecryptModal: React.FC<DecryptModalProps> = ({
  show,
  decryptKey,
  decryptError,
                                                              cameraId,
  onClose,
  onKeyChange
}) => {
    const { verifyKey, verifyResult, error: keyError, loading: keyLoading, clearError } = useKeyStore();
    const [submitted, setSubmitted] = useState(false); // ✅ 검증 시도 여부 표시

    if (!show) return null;

    // ✅ 키 검증 후 모달 닫기 로직
    const handleDecryptSubmit = async () => {
        setSubmitted(true);
        await verifyKey({
            accessToken: decryptKey, // 사용자가 입력한 키
            cameraId
        });
    };

  return (
    <div className={styles.decryptModal}>
      <div className={styles.decryptModalContent}>
        <h3>복호화키 입력</h3>
        <p>모자이크가 해제된 영상을 보려면 복호화키를 입력하세요.</p>
        <input
          type="password"
          value={decryptKey}
          onChange={(e) => onKeyChange(e.target.value)}
          placeholder="복호화키를 입력하세요"
          className={styles.decryptInput}
          onKeyPress={(e) => e.key === 'Enter' && handleDecryptSubmit()}
        />

          {/* 기존 에러 + 키 검증 실패 에러 */}
          {(decryptError || keyError) && (
              <div className={styles.decryptError}>
                  {decryptError || keyError}
                  {keyError && (
                      <button
                          onClick={clearError}
                          style={{
                              background: 'none',
                              color: 'red',
                              border: 'none',
                              marginLeft: 8,
                              cursor: 'pointer'
                          }}
                      >
                          닫기
                      </button>
                  )}
              </div>
          )}

          {/* ✅ 검증 성공 메시지 */}
          {submitted && verifyResult && (
              <div style={{ color: 'green', fontSize: '0.85rem', marginTop: 8 }}>
                  ✅ 키 검증 성공! 영상을 복호화합니다.
              </div>
          )}

          <div className={styles.decryptModalButtons}>
              <button
                  onClick={handleDecryptSubmit}
                  className={styles.submitBtn}
                  disabled={keyLoading}
              >
                  {keyLoading ? '검증 중...' : '확인'}
              </button>
              <button onClick={onClose} className={styles.cancelBtn}>
                  취소
              </button>
          </div>
      </div>
    </div>
  );
};
