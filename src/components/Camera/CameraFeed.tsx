import React, { useRef } from 'react';
import styles from './CameraFeed.module.css';
import { useCamera } from '../../hooks/useCamera';
import { useAIStreaming } from '../../hooks/useAIStreaming';
import { useDecryption } from '../../hooks/useDecryption';
import { VideoDisplay } from './VideoDisplay';
import { ControlPanel } from './ControlPanel';
import { DecryptModal } from './DecryptModal';

interface CameraFeedProps {
  decrypted?: boolean;
  enableAI?: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ decrypted = false, enableAI = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 커스텀 훅들 사용
  const {
    stream,
    error,
    isLoading,
    startCamera,
    stopCamera,
    checkPermission,
    retryCamera
  } = useCamera();

  const {
    isConnected,
    isStreaming,
    aiFrameCount,
    status,
    startAIStreaming,
    stopStreaming,
    testAIConnection,
    updateStatus,
    aiImageRef
  } = useAIStreaming();

  const {
    showDecryptModal,
    decryptKey,
    decryptError,
    isDecrypted,
    isAdmin,
      isModerator,
    handleDecryptSubmit,
    handleDecryptClick,
    setShowDecryptModal,
    setDecryptKey
  } = useDecryption();

  // AI 스트리밍 시작 핸들러
  const handleStartAIStreaming = async () => {
    if (videoRef.current) {
      await startAIStreaming(videoRef.current);
    }
  };

  return (
    <div className={styles.container}>
      {/* 비디오 표시 컴포넌트 */}
             <VideoDisplay
         stream={stream}
         isLoading={isLoading}
         error={error}
         enableAI={enableAI}
         isStreaming={isStreaming}
         videoRef={videoRef}
         aiImageRef={aiImageRef}
         onRetry={startCamera}
         onRetryCamera={retryCamera}
       />

      {/* 컨트롤 패널 컴포넌트 */}
      <ControlPanel
        enableAI={enableAI}
        stream={stream}
        isStreaming={isStreaming}
        isConnected={isConnected}
        isDecrypted={isDecrypted}
        isAdmin={isAdmin}
        isModerator={isModerator}
        status={status}
        aiFrameCount={aiFrameCount}
        onStartAIStreaming={handleStartAIStreaming}
        onStopStreaming={stopStreaming}
        onTestAIConnection={testAIConnection}
        onDecryptClick={handleDecryptClick}
      />

      {/* 복호화 모달 컴포넌트 */}
      <DecryptModal
        show={showDecryptModal}
        decryptKey={decryptKey}
        decryptError={decryptError}
        onDecryptSubmit={handleDecryptSubmit}
        onClose={() => setShowDecryptModal(false)}
        onKeyChange={setDecryptKey}
      />
    </div>
  );
};

export default CameraFeed;
