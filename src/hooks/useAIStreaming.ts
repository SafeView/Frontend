import React, {useState, useCallback, useRef, useEffect} from 'react';
import {AIService, DEFAULT_AI_CONFIG} from '../services/aiService';
import useVideoStore from "../stores/videoStore.ts";
import useUserStore from "../stores/userStore.ts";

/**
 * ✅ useAIStreaming Hook
 * - AI WebSocket 서버와 연결하여 영상 프레임을 주고받는 스트리밍 관리 훅
 * - 프레임 수신, 상태 관리, 유저 ID 전송, 스트리밍 제어 등을 담당
 */

interface UseAIStreamingReturn {
    isConnected: boolean;                        // 현재 AI 서버에 연결 상태
    isStreaming: boolean;                        // 프레임 스트리밍 여부
    aiFrameCount: number;                        // 수신된 프레임 개수
    status: string;                              // 상태 메시지 (UI 출력용)
    startAIStreaming: (videoElement: HTMLVideoElement) => Promise<void>;  // 스트리밍 시작
    stopStreaming: () => Promise<void>;          // 스트리밍 중단
    testAIConnection: () => Promise<void>;       // AI 서버 연결 테스트
    updateStatus: (message: string) => void;     // 상태 메시지 수동 업데이트
    aiImageRef: React.RefObject<HTMLImageElement | null>; // 프레임이 표시될 이미지 DOM 참조
    aiSvc: AIService;                            // 내부 AI 서비스 인스턴스
}

export const useAIStreaming = (): UseAIStreamingReturn => {
    // ✅ Zustand 스토어에서 userId 전송 메서드 가져오기
    const { sendUserId } = useVideoStore();

    // ✅ 유저 정보 불러오기 (user.id 필요)
    const { user } = useUserStore();

    // ✅ 상태 값들 정의
    const [isConnected, setIsConnected] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [aiFrameCount, setAiFrameCount] = useState(0);
    const [status, setStatus] = useState('대기 중');
    const aiImageRef = useRef<HTMLImageElement>(null); // 수신 프레임 표시할 <img> 태그 참조

    // ✅ AIService 인스턴스 1회 생성 (컴포넌트당 하나만 유지)
    const aiServiceRef = useRef<AIService | null>(null);
    if (!aiServiceRef.current) {
        aiServiceRef.current = new AIService(DEFAULT_AI_CONFIG);

        // ✅ JSON 메시지 핸들러 등록 (복호화/연결해제 메시지 수신 처리)
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
    const aiSvc = aiServiceRef.current!; // 별칭

    // ✅ 언마운트 시 연결 정리 및 메모리 해제
    useEffect(() => {
        return () => {
            aiSvc.disconnect().catch(() => {});
            if (aiImageRef.current?.src?.startsWith('blob:')) {
                URL.revokeObjectURL(aiImageRef.current.src);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ✅ 상태 메시지 업데이트 함수
    const updateStatus = useCallback((message: string) => {
        setStatus(prev => {
            if (prev === message) return prev; // 중복 메시지 방지
            return message;
        });
    }, []);

    // ✅ AI 서버 연결 테스트용 함수
    const testAIConnection = useCallback(async () => {
        updateStatus("AI 서버 연결 테스트 중...");
        const result = await aiSvc.testConnection();

        if (result.success) {
            updateStatus(`성공! AI 서버 연결: ${result.url}`);
        } else {
            updateStatus(result.error || "AI 서버 연결 테스트 실패");
        }
    }, [updateStatus, aiSvc]);

    // ✅ AI 스트리밍 시작
    const startAIStreaming = useCallback(async (videoElement: HTMLVideoElement) => {
        console.log('AI 스트리밍 시작 시도...');
        console.log('비디오 엘리먼트:', videoElement);

        if (!videoElement) {
            updateStatus("카메라 스트림이 준비되지 않았습니다.");
            return;
        }

        try {
            updateStatus("AI 서버 연결 중...");
            const result = await aiSvc.connect();

            if (result.success) {
                updateStatus("AI 서버 연결 성공! 프레임 전송 준비 중...");
                setIsConnected(true);

                // ✅ 유저 ID 전송 (존재 시)
                if (user && typeof user.id === 'number') {
                    await sendUserId(user.id).catch((e) => {
                        console.error("[userId 전송 실패]", e);
                    });
                }

                // ✅ 프레임 수신 처리 함수
                const handleFrameReceived = (data: ArrayBuffer) => {
                    if (!aiImageRef.current) {
                        console.warn('aiImageRef.current가 null입니다.');
                        return;
                    }

                    try {
                        const blob = new Blob([data], { type: "image/jpeg" });
                        const imageUrl = URL.createObjectURL(blob);

                        // 기존 blob 주소 해제
                        if (aiImageRef.current.src && aiImageRef.current.src.startsWith('blob:')) {
                            URL.revokeObjectURL(aiImageRef.current.src);
                        }

                        // 최초 한 번만 로드 이벤트 핸들러 등록
                        if (!aiImageRef.current.hasAttribute('data-handler-set')) {
                            aiImageRef.current.setAttribute('data-handler-set', 'true');

                            aiImageRef.current.onload = () => {
                                setAiFrameCount(prev => {
                                    const next = prev + 1;
                                    if (next % 50 === 0) {
                                        console.log(`🎥 ${next}번째 프레임 수신됨`);
                                        updateStatus(`AI 처리된 프레임 수신 중... (${next}개)`);
                                    }
                                    return next;
                                });
                            };

                            aiImageRef.current.onerror = (e) => {
                                console.error('AI 이미지 로드 실패:', e);
                                updateStatus("AI 이미지 로드 실패");
                            };
                        }

                        aiImageRef.current.src = imageUrl;
                        updateStatus("AI 처리된 프레임 수신 중...");

                    } catch (error) {
                        console.error('프레임 처리 중 오류:', error);
                        updateStatus("프레임 처리 오류");
                    }
                };

                // ✅ 프레임 전송 시작
                const frameResult = aiSvc.startFrameTransmission(
                    videoElement,
                    () => {}, // 전송 로그 생략
                    handleFrameReceived
                );

                if (frameResult.success) {
                    setIsStreaming(true);
                    updateStatus("프레임 전송 시작됨 (10fps)");

                    // 비디오 재생 보장
                    if (videoElement.paused) {
                        videoElement.play().catch(e => console.error('비디오 재생 실패:', e));
                    }
                } else {
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
    }, [updateStatus, aiSvc, user, sendUserId]);

    // ✅ AI 스트리밍 중단 처리
    const stopStreaming = useCallback(async () => {
        try {
            updateStatus("스트리밍 중단 중...");
            await aiSvc.disconnect();

            setIsConnected(false);
            setIsStreaming(false);

            // 이미지 초기화 및 메모리 정리
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

    // ✅ Hook에서 반환하는 값들
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
