import React, { useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import CameraFeed from './CameraFeed';
import styles from './CCTVViewer.module.css';

interface CCTVViewerProps {
  cameraId: number;
  cameraName: string;
  location: string;
}

const CCTVViewer: React.FC<CCTVViewerProps> = ({ cameraId, cameraName, location }) => {
  const { user, isDecrypted, decryptionKey, setDecryptionKey, toggleDecryption } = useUserStore();
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState('');

  const isAdmin = user?.role === 'ADMIN';
  const isWebCam = cameraName === 'Web Cam';

  const handleKeySubmit = () => {
    if (tempKey.trim()) {
      setDecryptionKey(tempKey);
      toggleDecryption();
      setShowKeyInput(false);
      setTempKey('');
    }
  };

  const handleDecryptToggle = () => {
    if (isDecrypted) {
      toggleDecryption();
    } else {
      setShowKeyInput(true);
    }
  };

  return (
    <div className={styles.container}>
      {/* 카메라 정보 헤더 */}
      <div className={styles.cameraHeader}>
        <div className={styles.cameraInfo}>
          <h2 className={styles.cameraTitle}>{cameraName} - Live View</h2>
          <span className={styles.location}>{location}</span>
        </div>
        
        {/* 어드민 전용 복호화 컨트롤 */}
        {isAdmin && (
          <div className={styles.adminControls}>
            <button
              className={`${styles.decryptBtn} ${isDecrypted ? styles.active : ''}`}
              onClick={handleDecryptToggle}
            >
              {isDecrypted ? '복호화됨' : '복호화'}
            </button>
          </div>
        )}
      </div>

      {/* 복호화키 입력 모달 */}
      {showKeyInput && (
        <div className={styles.keyModal}>
          <div className={styles.keyModalContent}>
            <h3>복호화키 입력</h3>
            <p>모자이크가 해제된 영상을 보려면 복호화키를 입력하세요.</p>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="복호화키를 입력하세요"
              className={styles.keyInput}
              onKeyPress={(e) => e.key === 'Enter' && handleKeySubmit()}
            />
            <div className={styles.keyModalButtons}>
              <button onClick={handleKeySubmit} className={styles.submitBtn}>
                확인
              </button>
              <button onClick={() => setShowKeyInput(false)} className={styles.cancelBtn}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 영상 표시 영역 */}
      <div className={styles.videoArea}>
        {isWebCam ? (
          // Web Cam은 AI 처리된 영상 표시
          <CameraFeed enableAI={true} decrypted={isDecrypted} />
        ) : (
          // 일반 CCTV는 모자이크 처리된 영상 표시
          <div className={styles.cctvContainer}>
            <video
              src={`/videos/cam${cameraId}.mp4`}
              className={`${styles.cctvVideo} ${isDecrypted ? '' : styles.mosaic}`}
              controls
              autoPlay
              muted
              loop
            />
            {!isDecrypted && (
              <div className={styles.mosaicOverlay}>
                <div className={styles.mosaicMessage}>
                  <span>모자이크 처리됨</span>
                  {isAdmin && (
                    <p>복호화키를 입력하여 원본 영상을 확인하세요.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 상태 표시 */}
      <div className={styles.statusBar}>
        <span className={styles.cameraStatus}>
          {cameraName} | {isDecrypted ? '복호화됨' : '모자이크 처리됨'}
        </span>
        {isAdmin && (
          <span className={styles.adminStatus}>
            관리자 권한
          </span>
        )}
      </div>
    </div>
  );
};

export default CCTVViewer; 