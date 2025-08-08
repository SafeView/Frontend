import React from 'react';
import styles from './CameraFeed.module.css';

interface ControlPanelProps {
  enableAI: boolean;
  stream: MediaStream | null;
  isStreaming: boolean;
  isConnected: boolean;
  isDecrypted: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  status: string;
  aiFrameCount: number;
  onStartAIStreaming: () => void;
  onStopStreaming: () => void;
  onTestAIConnection: () => void;
  onDecryptClick: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  enableAI,
  stream,
  isStreaming,
  isConnected,
  isDecrypted,
  isAdmin,
    isModerator,
  status,
  aiFrameCount,
  onStartAIStreaming,
  onStopStreaming,
  onTestAIConnection,
  onDecryptClick
}) => {
  if (!enableAI) return null;

  return (
    <div className={styles.controlPanel}>
      {/* 버튼 컨테이너 */}
      <div className={styles.buttonContainer}>
        <button
          onClick={onStartAIStreaming}
          disabled={!stream || isStreaming}
          className={styles.actionButton}
        >
          AI 서버 연결 및 시작
        </button>
        <button
          onClick={onTestAIConnection}
          className={styles.actionButton}
        >
          AI 서버 연결 테스트
        </button>

        <button
          onClick={onStopStreaming}
          disabled={!isStreaming}
          className={styles.actionButton}
        >
          AI 서버 연결 해제
        </button>



          {/* 복호화 버튼: 관리자 + 모더레이터 모두 허용 */}
          {(isAdmin || isModerator) && (
          <button
            onClick={onDecryptClick}
            className={`${styles.actionButton} ${isDecrypted ? styles.decryptActive : styles.decryptButton}`}
          >
            {isDecrypted ? '복호화됨' : '복호화'}
          </button>
        )}
      </div>

      {/* 상태 표시 */}
      <div className={styles.statusText}>
        {isDecrypted ? '복호화된 영상' : '원본 영상'}
        {stream && ` | 카메라 연결됨`}
        {enableAI && isStreaming && ` | AI 모드 활성화`}
        {enableAI && ` | ${status}`}
        {enableAI && aiFrameCount > 0 && ` | AI 프레임: ${aiFrameCount}개`}
          {(isAdmin || isModerator) && ` | ${isAdmin ? '관리자' : '중간관리자'} 권한`} {/* ✅ 표시 */}
        {enableAI && ` | AI 서버: ${isConnected ? '연결됨' : '연결 안됨'}`}
      </div>

      {/* 사용 안내 */}
      <div className={styles.instructions}>
        <strong>사용 안내:</strong><br />
        1. 브라우저에서 카메라 접근 권한을 허용해주세요<br />
        2. HTTPS 또는 localhost에서만 카메라 접근이 가능합니다<br />
        3. 다른 애플리케이션에서 카메라를 사용 중이면 종료해주세요
      </div>
    </div>
  );
};
