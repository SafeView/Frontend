// React 기본 훅 import
import React, { useRef } from 'react';

// 스타일 모듈 import
import styles from './CameraFeed.module.css';

// 커스텀 훅 import
import { useCamera } from '../../hooks/useCamera';              // 카메라 권한 및 스트리밍 제어
import { useAIStreaming } from '../../hooks/useAIStreaming';    // AI 분석용 스트리밍 처리
import { useDecryption } from '../../hooks/useDecryption';      // 복호화 키 입력 및 처리

// 서브 컴포넌트 import
import { VideoDisplay } from './VideoDisplay';                  // 영상 출력 전용 컴포넌트
import { ControlPanel } from './ControlPanel';                  // 우측 제어 패널
import { DecryptModal } from './DecryptModal';                  // 복호화 키 입력 모달

// 🔹 상위 컴포넌트에서 전달받는 props 정의
interface CameraFeedProps {
    decrypted?: boolean; // 모자이크 해제 여부 (초기 상태)
    enableAI?: boolean;  // AI 기능 활성화 여부
}

// 🔹 CameraFeed 컴포넌트 정의
const CameraFeed: React.FC<CameraFeedProps> = ({
                                                   decrypted = false,
                                                   enableAI = false
}) => {
    // 비디오 DOM 엘리먼트 참조 (스트리밍 연결용)
    const videoRef = useRef<HTMLVideoElement>(null);

    // ✅ 1. 카메라 훅
    const {
        stream,         // MediaStream 객체
        error,          // 스트리밍 중 발생한 에러
        isLoading,      // 카메라 로딩 중 여부
        startCamera,    // 카메라 시작 함수
        //stopCamera,   // 현재 사용되지 않음 (예비 구현)
        //checkPermission,
        retryCamera,    // 실패 시 재시도용 함수
    } = useCamera();

    // ✅ 2. AI 스트리밍 훅
    const {
        isConnected,        // AI 서버 연결 여부
        isStreaming,        // 현재 AI 스트리밍 중인지 여부
        aiFrameCount,       // 분석된 프레임 수
        status,             // 분석 상태 메시지
        startAIStreaming,   // AI 스트리밍 시작 함수
        stopStreaming,      // AI 스트리밍 종료 함수
        testAIConnection,   // 테스트 요청용 함수
        //updateStatus,
        aiImageRef,         // AI로 분석된 이미지 미리보기 ref
        aiSvc,              // ✅ AI 서비스 인스턴스 (복호화 훅에 넘겨줌)
    } = useAIStreaming();

    // ✅ 3. 복호화 훅 (aiSvc 주입)
    const {
        showDecryptModal,       // 모달 표시 여부
        decryptKey,             // 입력된 복호화 키
        decryptError,           // 복호화 실패 메시지
        isDecrypted,            // 현재 복호화 여부
        isAdmin,                // 관리자 권한 여부
        isModerator,            // 중간관리자 권한 여부
        handleDecryptClick,     // 복호화 요청 버튼 핸들러
        handleDecryptSubmit,    // 모달에서 키 제출 핸들러
        setShowDecryptModal,    // 모달 표시 여부 제어 함수
        setDecryptKey,          // 입력된 키 변경 함수
    } = useDecryption(aiSvc);

    // ✅ AI 분석 시작 버튼 클릭 시 실행
    const handleStartAIStreaming = async () => {
        if (videoRef.current) {
            await startAIStreaming(videoRef.current);
        }
    };

    // ✅ 스트림에서 카메라 ID를 추출 (MediaStream 객체에 없을 경우 기본값 사용)
    const cameraId = (stream as any)?.id || 'CAMERA_001';

    return (
        <div className={styles.container}>
            {/* 📺 영상 출력 영역 */}
            <VideoDisplay
                stream={stream}                 // 로컬 스트림 (MediaStream)
                isLoading={isLoading}           // 로딩 여부
                error={error}                   // 에러 메시지
                enableAI={enableAI}             // AI 활성화 여부
                isStreaming={isStreaming}       // 현재 AI 스트리밍 중인지
                videoRef={videoRef}             // 로컬 영상 참조
                aiImageRef={aiImageRef}         // 분석된 AI 이미지 (오버레이 가능)
                onRetry={startCamera}           // 최초 시도
                onRetryCamera={retryCamera}     // 재시도
            />

            {/* 🎛️ 제어 패널 (오른쪽) */}
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

            {/* 🔐 복호화 키 입력 모달 */}
            <DecryptModal
                show={showDecryptModal}         // 모달 표시 여부
                decryptKey={decryptKey}         // 현재 입력된 키
                decryptError={decryptError}     // 에러 메시지
                cameraId={cameraId}             // 스트림에서 가져온 카메라 ID
                onClose={() => setShowDecryptModal(false)} // 모달 닫기 핸들러
                onKeyChange={setDecryptKey}     // 키 입력 변경
                onSubmit={handleDecryptSubmit}  // 복호화 요청
            />
        </div>
    );
};

// 외부에서 사용할 수 있도록 export
export default CameraFeed;
