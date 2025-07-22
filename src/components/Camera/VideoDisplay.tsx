import React, { useRef, useEffect } from 'react';
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
        console.log('비디오 메타데이터 로드 완료');
        console.log('비디오 크기:', videoElement.videoWidth, 'x', videoElement.videoHeight);
      };
      
      const handleCanPlay = () => {
        console.log('비디오 재생 가능');
        // 자동 재생 시도
        if (videoElement.paused) {
          videoElement.play().catch(e => console.error('자동 재생 실패:', e));
        }
      };
      
      const handlePlay = () => {
        console.log('비디오 재생 시작됨');
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
      {/* 원본 카메라 영상 */}
      <div className={styles.videoItem}>
        <h3>원본 영상</h3>
        <video
          ref={videoRef}
          className={`${styles.video} ${styles.originalVideo}`}
          autoPlay
          playsInline
          muted
          onLoadStart={() => console.log('비디오 로드 시작')}
          onLoadedMetadata={() => console.log('비디오 메타데이터 로드됨')}
          onCanPlay={() => console.log('비디오 재생 가능')}
          onPlay={() => console.log('비디오 재생 시작')}
          onPause={() => console.log('비디오 일시정지')}
          onError={(e) => console.error('비디오 오류:', e)}
        />
      </div>
      
      {/* AI 처리된 영상 */}
      {enableAI && (
        <div className={styles.videoItem}>
          <h3>AI 처리된 영상</h3>
          <div className={styles.aiVideoWrapper}>
            <img
              ref={aiImageRef}
              className={styles.aiVideo}
              alt="AI 처리 영상"
              src={isStreaming ? undefined : ""}
              onLoad={(e) => {
                console.log('이미지 onLoad 이벤트 발생:', e.target);
                console.log('이미지 크기:', (e.target as HTMLImageElement).width, 'x', (e.target as HTMLImageElement).height);
              }}
              onError={(e) => {
                console.error('이미지 onError 이벤트 발생:', e);
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