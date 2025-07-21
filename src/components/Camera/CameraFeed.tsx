import React, { useRef, useEffect } from 'react';
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

  // 테스트 이미지 핸들러
  const handleTestImage = () => {
    if (aiImageRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#646cff';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AI 테스트 이미지', 320, 240);
        ctx.fillText(new Date().toLocaleTimeString(), 320, 280);
        
        const testUrl = canvas.toDataURL('image/jpeg');
        aiImageRef.current.src = testUrl;
        console.log('테스트 이미지 설정됨:', testUrl);
      }
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
        status={status}
        aiFrameCount={aiFrameCount}
        onStartAIStreaming={handleStartAIStreaming}
        onStopStreaming={stopStreaming}
        onTestAIConnection={testAIConnection}
        onCheckPermission={checkPermission}
        onDecryptClick={handleDecryptClick}
        onTestImage={handleTestImage}
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