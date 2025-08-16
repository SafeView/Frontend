// AI 관련 API 서비스
import {useAIStore} from "../stores/aiStore.ts";
import type {AutoRecordingFinalized, AutoRecordingStarted} from "../types/autorecording.ts";

type WSMessageIn =
    | {
    type: "verification_result";
    success: boolean;
    message?: string;
    canDecrypt?: boolean;
    isValid?: boolean;
    decryptionToken?: string;
    [k: string]: any
}
    | { type: "disconnect_result"; success: boolean; message?: string }
    | { type: string; [k: string]: any }; // 기타 안전망

type WSMessageOut =
    | { type: "key_verification"; accessToken: string; cameraId: string }
    | { type: "disconnect" };

export interface AIConnectionConfig {
    wsUrl: string;
    frameRate: number;
    quality: number;
}

export interface DecryptConfig {
    key: string;
    algorithm: string;
}

export class AIService {
    private ws: WebSocket | null = null;
    private frameInterval: number | null = null;
    private isConnected: boolean = false;
    private isStreaming: boolean = false;
    private config: AIConnectionConfig;

    // ✅ 외부에서 텍스트/바이너리 모두 구독할 수 있게 콜백 보관
    private binaryHandler: ((data: ArrayBuffer) => void) | null = null;   // 프레임 수신
    private jsonHandler: ((data: WSMessageIn) => void) | null = null;     // JSON 수신

    // ✅ 검증 응답을 기다리는 pending Promise 리졸버(단일 사용 가정)
    private pendingVerifyResolve: ((v: WSMessageIn) => void) | null = null;
    private pendingVerifyReject: ((e: any) => void) | null = null;

    constructor(config: AIConnectionConfig) {
        this.config = config;
    }

    // AI 서버 연결 테스트
    async testConnection(): Promise<{ success: boolean; url?: string; error?: string }> {
        const testUrls = [
            this.config.wsUrl,
            "ws://localhost:8000/ws/video",
            "ws://127.0.0.1:8000/ws",
            "ws://localhost:8000/ws",
            "ws://127.0.0.1:8000/video",
            "ws://localhost:8000/video"
        ];

        for (const url of testUrls) {
            try {
                const result = await this.testSingleUrl(url);
                if (result.success) {
                    return {success: true, url};
                }
            } catch (error) {
                console.error(`Failed to test ${url}:`, error);
            }
        }

        return {success: false, error: "모든 AI 서버 URL 테스트 실패"};
    }

    private testSingleUrl(url: string): Promise<{ success: boolean }> {
        return new Promise((resolve) => {
            const testWs = new WebSocket(url);

            testWs.onopen = () => {
                testWs.close();
                resolve({success: true});
            };

            testWs.onerror = () => {
                resolve({success: false});
            };

            // 3초 타임아웃
            setTimeout(() => {
                testWs.close();
                resolve({success: false});
            }, 3000);
        });
    }

    // AI 서버 연결
    async connect(): Promise<{ success: boolean; error?: string }> {
        try {
            this.ws = new WebSocket(this.config.wsUrl);
            this.ws.binaryType = "arraybuffer";

            return new Promise((resolve) => {
                if (!this.ws) {
                    resolve({success: false, error: "WebSocket 생성 실패"});
                    return;
                }

                // ✅ 단일 onmessage에서 바이너리/텍스트 모두 처리
                this.ws.onmessage = (event: MessageEvent) => {
                    try {
                        // 🎯 1. 텍스트(JSON) 메시지인 경우
                        if (typeof event.data === "string") {
                            const parsed: WSMessageIn = JSON.parse(event.data);

                            // ✅ 외부 JSON 수신 핸들러 먼저 전달
                            if (this.jsonHandler) this.jsonHandler(parsed);

                            // 🔐 키 검증 응답 처리 (Promise 방식)
                            if (parsed.type === "verification_result" && this.pendingVerifyResolve) {
                                this.pendingVerifyResolve(parsed);
                                this.pendingVerifyResolve = null;
                                this.pendingVerifyReject = null;
                            }

                            // 🧹 disconnect 응답 처리
                            if (parsed.type === "disconnect_result") {
                                console.info("[🔌 DISCONNECT 결과]:", parsed);
                            }

                            // 🎥 자동 녹화 시작 메시지 수신 시 로그 출력
                            if (parsed.type === "auto_recording_started") {
                                console.log("[🎥 자동 녹화 시작]:", parsed);
                                useAIStore.getState().startAutoRecording(parsed as AutoRecordingStarted); // ✅ 명시적 캐스팅
                            }

                            // 📁 자동 녹화 종료 메시지 수신 시 로그 출력
                            if (parsed.type === "auto_recording_finalized") {
                                console.log("[📁 자동 녹화 종료]:", parsed);
                                useAIStore.getState().stopAutoRecording(parsed as AutoRecordingFinalized); // ✅ 명시적 캐스팅
                            }

                            return; // 메시지 처리 종료
                        }

                        // 🎯 2. 바이너리 프레임 (ArrayBuffer)
                        if (event.data instanceof ArrayBuffer) {
                            if (this.binaryHandler) this.binaryHandler(event.data);
                            return;
                        }

                        // 🎯 3. Blob 형태일 경우 ArrayBuffer로 변환 후 전달
                        if (event.data instanceof Blob) {
                            (event.data as Blob).arrayBuffer().then((buf) => {
                                if (this.binaryHandler) this.binaryHandler(buf);
                            });
                        }

                    } catch (e) {
                        console.error("📛 WS 메시지 파싱 오류:", e);
                    }
                };

                this.ws.onopen = () => {
                    this.isConnected = true;
                    resolve({success: true});
                };

                this.ws.onerror = (error) => {
                    console.error("AI server WebSocket error:", error);
                    this.isConnected = false;
                    // ✅ 보류 중인 verification이 있으면 reject
                    if (this.pendingVerifyReject) {
                        this.pendingVerifyReject(error);
                        this.pendingVerifyResolve = null;
                        this.pendingVerifyReject = null;
                    }
                    resolve({success: false, error: "AI 서버 연결 오류"});
                };


                this.ws.onclose = () => {
                    this.isConnected = false;
                    this.isStreaming = false;
                    // ✅ 보류 중인 verification이 있으면 reject
                    if (this.pendingVerifyReject) {
                        this.pendingVerifyReject(new Error("WebSocket closed"));
                        this.pendingVerifyResolve = null;
                        this.pendingVerifyReject = null;
                    }
                };
            });

        } catch (error) {
            return {success: false, error: "연결 시도 중 오류 발생"};
        }
    }

    // ✅ 외부에서 수신 콜백 등록 (선택)
    onBinaryMessage(handler: (data: ArrayBuffer) => void) {
        this.binaryHandler = handler;
    }

    onJsonMessage(handler: (data: WSMessageIn) => void) {
        this.jsonHandler = handler;
    }

    // ✅ 안전한 JSON 전송 헬퍼
    private sendJSON(payload: WSMessageOut): { success: boolean; error?: string } {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return {success: false, error: "WebSocket이 연결되지 않았습니다"};
        }
        try {
            this.ws.send(JSON.stringify(payload));
            return {success: true};
        } catch (e: any) {
            return {success: false, error: e?.message || "메시지 전송 실패"};
        }
    }

    // ✅ 명세에 따른 모자이크 해제(키 검증) 요청
    requestDecryption(
        accessToken: string,
        cameraId: string,
        timeoutMs: number = 5000
    ): Promise<WSMessageIn> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return Promise.reject(new Error("WebSocket이 연결되지 않았습니다"));
        }

        // 기존 대기자 있으면 정리
        if (this.pendingVerifyReject) {
            this.pendingVerifyReject(new Error("새로운 검증 요청으로 이전 요청 취소"));
            this.pendingVerifyResolve = null;
            this.pendingVerifyReject = null;
        }

        // 전송
        const sendRes = this.sendJSON({type: "key_verification", accessToken, cameraId});
        if (!sendRes.success) {
            return Promise.reject(new Error(sendRes.error || "전송 실패"));
        }

        // 응답 대기
        return new Promise<WSMessageIn>((resolve, reject) => {
            this.pendingVerifyResolve = resolve;
            this.pendingVerifyReject = reject;

            // 타임아웃
            const to = setTimeout(() => {
                if (this.pendingVerifyReject) {
                    this.pendingVerifyReject(new Error("검증 응답 타임아웃"));
                }
                this.pendingVerifyResolve = null;
                this.pendingVerifyReject = null;
            }, timeoutMs);

            // 응답을 받으면 위 onmessage에서 resolve 후 여기 타임아웃 해제
            const origResolve = this.pendingVerifyResolve;
            this.pendingVerifyResolve = (msg) => {
                clearTimeout(to);
                origResolve?.(msg);
            };
        });
    }

    // ✅ 명세에 따른 개별 연결 중단 요청
    async requestDisconnect(timeoutMs: number = 3000): Promise<WSMessageIn | null> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return null;
        }

        // disconnect는 응답이 오지만 대기 필수는 아님. 필요하면 promise로 대기.
        try {
            const sendRes = this.sendJSON({type: "disconnect"});
            if (!sendRes.success) throw new Error(sendRes.error || "disconnect 전송 실패");

            // 원한다면 간단히 일정 시간 대기하며 마지막 응답을 한 번만 캡처
            return new Promise<WSMessageIn | null>((resolve) => {
                let captured: WSMessageIn | null = null;
                const handler = (msg: WSMessageIn) => {
                    if (msg.type === "disconnect_result") captured = msg;
                };
                const prevHandler = this.jsonHandler;
                this.jsonHandler = (msg) => {
                    prevHandler?.(msg);
                    handler(msg);
                };
                setTimeout(() => {
                    // 핸들러 원복
                    this.jsonHandler = prevHandler || null;
                    resolve(captured);
                }, timeoutMs);
            });
        } catch (e) {
            console.error("requestDisconnect error:", e);
            return null;
        }
    }

    // 프레임 전송 시작
    startFrameTransmission(
        videoElement: HTMLVideoElement,
        onFrameSent?: (size: number) => void,
        onFrameReceived?: (data: ArrayBuffer) => void
    ): { success: boolean; error?: string } {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return {success: false, error: "WebSocket이 연결되지 않았습니다"};
        }
        if (this.isStreaming) {
            return {success: false, error: "이미 스트리밍 중입니다"};
        }

        // ✅ 외부에서 바이너리 콜백을 넘기면 등록
        if (onFrameReceived) {
            this.onBinaryMessage(onFrameReceived);
        }


        // 캔버스 생성
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return {success: false, error: "캔버스 컨텍스트 생성 실패"};

        const sendFrame = () => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !videoElement) return;

            if (
                videoElement.videoWidth > 0 &&
                videoElement.videoHeight > 0 &&
                videoElement.readyState >= 2 // HAVE_CURRENT_DATA
            ) {
                try {
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(
                        (blob) => {
                            if (blob && this.ws && this.ws.readyState === WebSocket.OPEN) {
                                this.ws.send(blob);
                                onFrameSent?.(blob.size);
                            }
                        },
                        "image/jpeg",
                        this.config.quality
                    );
                } catch (error) {
                    console.error("프레임 캡처 오류:", error);
                }
            }
        };

        this.frameInterval = window.setInterval(sendFrame, 1000 / this.config.frameRate);
        this.isStreaming = true;

        return {success: true};
    }

    // 프레임 전송 중단
    stopFrameTransmission(): void {
        if (this.frameInterval) {
            clearInterval(this.frameInterval);
            this.frameInterval = null;
        }
        this.isStreaming = false;
    }

    // 연결 종료
    // ✅ 소프트 디스커넥트 → 서버에 disconnect 요청 후 닫기
    async disconnect(): Promise<void> {
        this.stopFrameTransmission();

        // 먼저 서버에 disconnect 알림
        try {
            await this.requestDisconnect(1000);
        } catch { /* 무시 */
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
        this.isStreaming = false;

        // pending 정리
        if (this.pendingVerifyReject) {
            this.pendingVerifyReject(new Error("Disconnected"));
            this.pendingVerifyResolve = null;
            this.pendingVerifyReject = null;
        }
    }

    // 상태 확인
    getStatus(): { isConnected: boolean; isStreaming: boolean } {
        return {isConnected: this.isConnected, isStreaming: this.isStreaming};
    }
}

export const DEFAULT_AI_CONFIG: AIConnectionConfig = {
    wsUrl: 'ws://localhost:8000/ws/video',
    frameRate: 10,
    quality: 0.8
};
