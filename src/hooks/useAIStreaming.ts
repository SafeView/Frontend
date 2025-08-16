import React, {useState, useCallback, useRef, useEffect} from 'react';
import {AIService, DEFAULT_AI_CONFIG} from '../services/aiService';


interface UseAIStreamingReturn {
    isConnected: boolean;
    isStreaming: boolean;
    aiFrameCount: number;
    status: string;
    startAIStreaming: (videoElement: HTMLVideoElement) => Promise<void>;
    stopStreaming: () => Promise<void>; // ✅ disconnect가 async이므로 Promise<void>
    testAIConnection: () => Promise<void>;
    updateStatus: (message: string) => void;
    aiImageRef: React.RefObject<HTMLImageElement | null>;
    aiSvc: AIService;
}

export const useAIStreaming = (): UseAIStreamingReturn => {
    const [isConnected, setIsConnected] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [aiFrameCount, setAiFrameCount] = useState(0);
    const [status, setStatus] = useState('대기 중');
    const aiImageRef = useRef<HTMLImageElement>(null);

    // ✅ 훅 내부에서 AIService 인스턴스 1회 생성해 보관
    // ✅ 인스턴스 1회 생성
    const aiServiceRef = useRef<AIService | null>(null);
    if (!aiServiceRef.current) {
        // ✅ DEFAULT_AI_CONFIG가 없다면 아래 대체안 사용:
        // const INIT: AIConnectionConfig = { wsUrl: 'ws://localhost:8000/ws/video', frameRate: 10, quality: 0.8 };
        // aiServiceRef.current = new AIService(INIT);
        aiServiceRef.current = new AIService(DEFAULT_AI_CONFIG);

        // JSON 제어 메시지 구독(검증/디스커넥트)
        aiServiceRef.current.onJsonMessage((msg) => {
            if (msg.type === 'verification_result') {
                setStatus(msg.success ? '복호화 승인: 모자이크 해제' : `복호화 실패${msg.message ? ` - ${msg.message}` : ''}`);
            }
            if (msg.type === 'disconnect_result') {
                setStatus(msg.message || '연결이 해제되었습니다.');
                setIsConnected(false);
                setIsStreaming(false);
            }
        });
    }
    const aiSvc = aiServiceRef.current!; // alias

    // ✅ 언마운트시 정리
    useEffect(() => {
        return () => {
            aiSvc.disconnect().catch(() => {});
            if (aiImageRef.current?.src?.startsWith('blob:')) {
                URL.revokeObjectURL(aiImageRef.current.src);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateStatus = useCallback((message: string) => {
        setStatus(prev => {
            if (prev === message) return prev; // 동일 메시지는 무시
            //console.log("Status:", message);
            return message;
        });
    }, []);

    const testAIConnection = useCallback(async () => {
        updateStatus("AI 서버 연결 테스트 중...");

        // ✅ 인스턴스 메서드 사용
        const result = await aiSvc.testConnection();

        if (result.success) {
            updateStatus(`성공! AI 서버 연결: ${result.url}`);
        } else {
            updateStatus(result.error || "AI 서버 연결 테스트 실패");
        }
    }, [updateStatus, aiSvc]);

    const startAIStreaming = useCallback(async (videoElement: HTMLVideoElement) => {
        console.log('AI 스트리밍 시작 시도...');
        console.log('비디오 엘리먼트:', videoElement);

        if (!videoElement) {
            updateStatus("카메라 스트림이 준비되지 않았습니다.");
            return;
        }

        try {
            updateStatus("AI 서버 연결 중...");

            // ✅ 수정: 인스턴스 메서드 사용
            const result = await aiSvc.connect();

            if (result.success) {
                updateStatus("AI 서버 연결 성공! 프레임 전송 준비 중...");
                setIsConnected(true);

                // 프레임 수신 핸들러 설정
                const handleFrameReceived = (data: ArrayBuffer) => {
                    // aiImageRef가 존재하는지 확인
                    if (!aiImageRef.current) {
                        console.warn('aiImageRef.current가 null입니다. DOM 요소가 아직 생성되지 않았을 수 있습니다.');
                        return;
                    }

                    try {
                        const blob = new Blob([data], { type: "image/jpeg" });
                        const imageUrl = URL.createObjectURL(blob);

                        // 이전 URL 해제
                        if (aiImageRef.current.src && aiImageRef.current.src.startsWith('blob:')) {
                            URL.revokeObjectURL(aiImageRef.current.src);
                        }

                        // 이미지 로드 이벤트 핸들러 설정 (한 번만)
                        if (!aiImageRef.current.hasAttribute('data-handler-set')) {
                            aiImageRef.current.setAttribute('data-handler-set', 'true');

                            aiImageRef.current.onload = () => {
                                // ✅ 수정: 함수형 업데이트로 정확한 카운트 유지 (stale 방지)
                                setAiFrameCount(prev => {
                                    const next = prev + 1;

                                    // ✅ 콘솔 출력은 50프레임마다만
                                    if (next % 50 === 0) {
                                        console.log(`🎥 ${next}번째 프레임 수신됨`);
                                        updateStatus(`AI 처리된 프레임 수신 중... (${next}개)`); // 이건 UI 상태용

                                    }

                                    return next;
                                });
                            };

                            aiImageRef.current.onerror = (e) => {
                                console.error('AI 이미지 로드 실패:', e);
                                updateStatus("AI 이미지 로드 실패");
                            };
                        }

                        // 새 이미지 설정
                        aiImageRef.current.src = imageUrl;
                        updateStatus("AI 처리된 프레임 수신 중...");

                    } catch (error) {
                        console.error('프레임 처리 중 오류:', error);
                        updateStatus("프레임 처리 오류");
                    }
                };

                // 프레임 전송 시작
                // ✅ 수정: 인스턴스 메서드 사용
                const frameResult = aiSvc.startFrameTransmission(
                    videoElement,
                    // (size) => console.log('프레임 전송:', size, 'bytes'),
                    () => {}, // 로그 제거
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
    }, [updateStatus, aiSvc]);

    const stopStreaming = useCallback(async () => {
        try {
            updateStatus("스트리밍 중단 중...");

            // ✅ 수정: 서비스가 async disconnect를 제공 → await로 종료 보장
            await aiSvc.disconnect();

            setIsConnected(false);
            setIsStreaming(false);

            // AI 이미지 초기화 + blob 해제
            if (aiImageRef.current) {
                if (aiImageRef.current.src && aiImageRef.current.src.startsWith('blob:')) {
                    URL.revokeObjectURL(aiImageRef.current.src);
                }
                aiImageRef.current.src = '';
                aiImageRef.current.removeAttribute('data-handler-set');
            }

            updateStatus("스트리밍이 중단되었습니다.");

        } catch (error: any) {
            updateStatus("중단 오류: " + error.message);
            console.error("Disconnect error:", error);
        }
    }, [updateStatus, aiSvc]);

    return {
        isConnected,
        isStreaming,
        aiFrameCount,
        status,
        startAIStreaming,
        stopStreaming,
        testAIConnection,
        updateStatus,
        aiImageRef,
        aiSvc,
    };
};
