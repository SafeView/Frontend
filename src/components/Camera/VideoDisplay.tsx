import React, { useEffect } from 'react';
import styles from './VideoDisplay.module.css';

interface VideoDisplayProps {
  stream: MediaStream | null;
  isLoading: boolean;
  error: string | null;
  enableAI: boolean;
  isStreaming: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  aiImageRef: React.RefObject<HTMLImageElement | null>;
  onRetry: () => void;
  onRetryCamera?: () => void;
}

export const VideoDisplay: React.FC<VideoDisplayProps> = ({
  stream,
  isLoading,
  error,
  enableAI,
  isStreaming,
  videoRef,
  aiImageRef,
  onRetry,
  onRetryCamera
}) => {

  // 비디오 스트림 설정
  useEffect(() => {
    if (videoRef.current && stream) {
      console.log('비디오 엘리먼트에 스트림 설정:', stream);
      videoRef.current.srcObject = stream;

      // 이벤트 핸들러 설정
      const videoElement = videoRef.current;

      const handleLoadedMetadata = () => {
        // console.log('비디오 메타데이터 로드 완료');
        // console.log('비디오 크기:', videoElement.videoWidth, 'x', videoElement.videoHeight);
      };

      const handleCanPlay = () => {
        //console.log('비디오 재생 가능');
        // 자동 재생 시도
        if (videoElement.paused) {
          videoElement.play().catch(e => console.error('자동 재생 실패:', e));
        }
      };

      const handlePlay = () => {
        //console.log('비디오 재생 시작됨');
      };

      const handleError = (e: Event) => {
        console.error('비디오 에러:', e);
      };

      // 이벤트 리스너 등록
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('error', handleError);

      // 클린업 함수
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [stream]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <div className={styles.errorButtonContainer}>
          <button
            onClick={onRetry}
            className={styles.retryButton}
          >
            다시 시도
          </button>
          {onRetryCamera && (
            <button
              onClick={onRetryCamera}
              className={styles.cameraReconnectButton}
            >
              카메라 재연결
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.videoContainer}>
      {/* 화면에는 보이지 않지만, 프레임 캡처를 위해 재생 유지 */}
      <video
        ref={videoRef}
        className={styles.hiddenCaptureVideo}
        autoPlay
        playsInline
        muted
      />

      {/* AI 처리된 영상만 표시 */}
      {enableAI && (
        <div className={styles.videoItem}>
          <div className={styles.aiVideoWrapper}>
            <img
              ref={aiImageRef}
              className={styles.aiVideo}
              alt="AI 처리 영상"
              src={isStreaming ? undefined : ""}
              onLoad={() => {}}
              onError={(e) => {
                console.error('AI 처리 영상 로딩 오류:', e);
              }}
            />
            {!isStreaming && (
              <div className={styles.aiWaitingOverlay}>
                AI 서버 연결 대기 중...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
