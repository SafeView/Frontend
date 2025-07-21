import React from 'react';
import styles from './CameraFeed.module.css';

interface DecryptModalProps {
  show: boolean;
  decryptKey: string;
  decryptError: string;
  onDecryptSubmit: () => void;
  onClose: () => void;
  onKeyChange: (key: string) => void;
}

export const DecryptModal: React.FC<DecryptModalProps> = ({
  show,
  decryptKey,
  decryptError,
  onDecryptSubmit,
  onClose,
  onKeyChange
}) => {
  if (!show) return null;

  return (
    <div className={styles.decryptModal}>
      <div className={styles.decryptModalContent}>
        <h3>🔐 복호화키 입력</h3>
        <p>모자이크가 해제된 영상을 보려면 복호화키를 입력하세요.</p>
        <input
          type="password"
          value={decryptKey}
          onChange={(e) => onKeyChange(e.target.value)}
          placeholder="복호화키를 입력하세요"
          className={styles.decryptInput}
          onKeyPress={(e) => e.key === 'Enter' && onDecryptSubmit()}
        />
        {decryptError && (
          <div className={styles.decryptError}>
            {decryptError}
          </div>
        )}
        <div className={styles.decryptModalButtons}>
          <button onClick={onDecryptSubmit} className={styles.submitBtn}>
            확인
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}; 