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

//@ts-ignore
const CameraFeed: React.FC<CameraFeedProps> = ({ decrypted = false, enableAI = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // ✅ 카메라 훅
    const {
        stream,
        error,
        isLoading,
        startCamera,
        //stopCamera,
        //checkPermission,
        retryCamera,
    } = useCamera();

    // ✅ AI 스트리밍 훅 (서비스 인스턴스 포함)
    const {
        isConnected,
        isStreaming,
        aiFrameCount,
        status,
        startAIStreaming,
        stopStreaming,
        testAIConnection,
        //updateStatus,
        aiImageRef,
        aiSvc, // ✅ 추가: Decryption 훅에 주입할 서비스 인스턴스
    } = useAIStreaming();

    // ✅ 복호화 훅 (서비스 인스턴스 주입)
    const {
        showDecryptModal,
        decryptKey,
        decryptError,
        isDecrypted,
        isAdmin,
        isModerator,
        handleDecryptClick,
        handleDecryptSubmit,      // ✅ 추가: 모달에서 사용할 제출 핸들러
        setShowDecryptModal,
        setDecryptKey,
    } = useDecryption(aiSvc);

    // AI 스트리밍 시작
    const handleStartAIStreaming = async () => {
        if (videoRef.current) {
            await startAIStreaming(videoRef.current);
        }
    };

    // 스트림에서 카메라 ID 가져오기 (없으면 기본값)
    const cameraId = (stream as any)?.id || 'CAMERA_001'; // ✅ 주의: MediaStream에 id 없을 수 있어 기본값 유지


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
                // isDecrypted={isDecrypted}
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
                cameraId={cameraId}
                onClose={() => setShowDecryptModal(false)}
                onKeyChange={setDecryptKey}
                onSubmit={handleDecryptSubmit}
                // loading={loading}               // 옵션: useDecryption에 로딩 추가 시 연결
                // onClearError={clearError}       // 옵션: useDecryption에 clear 추가 시 연결
            />
        </div>
    );
};

export default CameraFeed;
