import { useState, useCallback, useRef } from 'react';
import { aiService } from '../services/aiService';

interface UseAIStreamingReturn {
  isConnected: boolean;
  isStreaming: boolean;
  aiFrameCount: number;
  status: string;
  startAIStreaming: (videoElement: HTMLVideoElement) => Promise<void>;
  stopStreaming: () => void;
  testAIConnection: () => Promise<void>;
  updateStatus: (message: string) => void;
  aiImageRef: React.RefObject<HTMLImageElement | null>;
}

export const useAIStreaming = (): UseAIStreamingReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiFrameCount, setAiFrameCount] = useState(0);
  const [status, setStatus] = useState('대기 중');
  const aiImageRef = useRef<HTMLImageElement>(null);

  const updateStatus = useCallback((message: string) => {
    setStatus(message);
    console.log("Status:", message);
  }, []);

  const testAIConnection = useCallback(async () => {
    updateStatus("AI 서버 연결 테스트 중...");
    
    const result = await aiService.testConnection();
    
    if (result.success) {
      updateStatus(`성공! AI 서버 연결: ${result.url}`);
    } else {
      updateStatus(result.error || "AI 서버 연결 테스트 실패");
    }
  }, [updateStatus]);

  const startAIStreaming = useCallback(async (videoElement: HTMLVideoElement) => {
    console.log('AI 스트리밍 시작 시도...');
    console.log('비디오 엘리먼트:', videoElement);
    
    if (!videoElement) {
      updateStatus("카메라 스트림이 준비되지 않았습니다.");
      return;
    }

    try {
      updateStatus("AI 서버 연결 중...");
      
      const result = await aiService.connect();
      
      if (result.success) {
        updateStatus("AI 서버 연결 성공! 프레임 전송 준비 중...");
        setIsConnected(true);
        
        // 프레임 수신 핸들러 설정
        const handleFrameReceived = (data: ArrayBuffer) => {
          console.log('AI 서버에서 프레임 수신:', data.byteLength, 'bytes');
          console.log('데이터 타입:', typeof data, 'ArrayBuffer:', data instanceof ArrayBuffer);
          
          // 데이터가 JPEG 시그니처를 가지고 있는지 확인
          const bytes = new Uint8Array(data);
          const isJPEG = bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xD8;
          console.log('JPEG 시그니처 확인:', isJPEG, '첫 번째 바이트:', bytes[0], bytes[1]);
          
          // aiImageRef가 존재하는지 확인
          if (!aiImageRef.current) {
            console.error('aiImageRef.current가 null입니다. DOM 요소가 아직 생성되지 않았을 수 있습니다.');
            return;
          }
          
          try {
            const blob = new Blob([data], { type: "image/jpeg" });
            console.log('Blob 생성 완료:', blob.size, 'bytes, type:', blob.type);
            
            const imageUrl = URL.createObjectURL(blob);
            console.log('AI 이미지 URL 생성:', imageUrl);
            
            // 이전 URL 해제
            if (aiImageRef.current.src && aiImageRef.current.src.startsWith('blob:')) {
              URL.revokeObjectURL(aiImageRef.current.src);
              console.log('이전 URL 해제됨');
            }
            
            // 이미지 로드 이벤트 핸들러 설정 (한 번만)
            if (!aiImageRef.current.hasAttribute('data-handler-set')) {
              aiImageRef.current.setAttribute('data-handler-set', 'true');
              console.log('이미지 핸들러 설정됨');
              
              aiImageRef.current.onload = () => {
                console.log('AI 이미지 로드 완료, 크기:', aiImageRef.current?.width, 'x', aiImageRef.current?.height);
                setAiFrameCount(prev => prev + 1);
                updateStatus(`AI 처리된 프레임 수신 중... (${aiFrameCount + 1}개)`);
              };
              
              aiImageRef.current.onerror = (e) => {
                console.error('AI 이미지 로드 실패:', e);
                console.error('이미지 src:', aiImageRef.current?.src);
                updateStatus("AI 이미지 로드 실패");
              };
            }
            
            // 새 이미지 설정
            console.log('이미지 src 설정:', imageUrl);
            aiImageRef.current.src = imageUrl;
            updateStatus("AI 처리된 프레임 수신 중...");
            
          } catch (error) {
            console.error('프레임 처리 중 오류:', error);
            updateStatus("프레임 처리 오류");
          }
        };

        // 프레임 전송 시작
        const frameResult = aiService.startFrameTransmission(
          videoElement,
          (size) => console.log('프레임 전송:', size, 'bytes'),
          handleFrameReceived
        );

        if (frameResult.success) {
          setIsStreaming(true);
          updateStatus("프레임 전송 시작됨 (10fps)");
          
          // 비디오가 계속 재생되도록 보장
          if (videoElement.paused) {
            videoElement.play().catch(e => console.error('비디오 재생 실패:', e));
          }
        } else {
          // 프레임 전송이 실패해도 원본 카메라는 계속 표시
          updateStatus(frameResult.error || "프레임 전송 시작 실패 - 원본 카메라 계속 표시");
        }
      } else {
        updateStatus(result.error || "AI 서버 연결 실패");
        setIsConnected(false);
      }
      
    } catch (error: any) {
      updateStatus("AI 스트리밍 시작 오류: " + error.message);
      console.error("AI streaming error:", error);
    }
  }, [updateStatus, aiFrameCount]);

  const stopStreaming = useCallback(async () => {
    try {
      updateStatus("스트리밍 중단 중...");
      
      // AI 서비스 연결 종료
      aiService.disconnect();
      
      setIsConnected(false);
      setIsStreaming(false);
      
      // AI 이미지 초기화
      if (aiImageRef.current) {
        aiImageRef.current.src = '';
      }
      
      updateStatus("스트리밍이 중단되었습니다.");
      
    } catch (error: any) {
      updateStatus("중단 오류: " + error.message);
      console.error("Disconnect error:", error);
    }
  }, [updateStatus]);

  return {
    isConnected,
    isStreaming,
    aiFrameCount,
    status,
    startAIStreaming,
    stopStreaming,
    testAIConnection,
    updateStatus,
    aiImageRef
  };
}; 