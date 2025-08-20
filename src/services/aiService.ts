// AI 관련 API 서비스
import {useAIStore} from "../stores/aiStore.ts";
import type {AutoRecordingFinalized, AutoRecordingStarted} from "../types/autorecording.ts";

// WebSocket 수신 메시지 타입
// 클라이언트가 받을 수 있는 다양한 메시지 구조 정의
type WSMessageIn =
    | {
    type: "verification_result";
    success: boolean;
    message?: string;
    canDecrypt?: boolean;
    isValid?: boolean;
    decryptionToken?: string;
    [k: string]: any;
}
    | { type: "disconnect_result"; success: boolean; message?: string }
    | { type: string; [k: string]: any }; // 기타 메시지용 백업 구조

// WebSocket 송신 메시지 타입
// 클라이언트가 서버로 보낼 수 있는 메시지 정의
type WSMessageOut =
    | { type: "key_verification"; accessToken: string; cameraId: string }
    | { type: "disconnect" };

// AI 서버 연결 설정 인터페이스
export interface AIConnectionConfig {
    wsUrl: string;
    frameRate: number;
    quality: number;
}

// 모자이크 복호화 키 관련 설정 인터페이스
export interface DecryptConfig {
    key: string;
    algorithm: string;
}

export class AIService {
    private ws: WebSocket | null = null;                     // WebSocket 인스턴스
    private frameInterval: number | null = null;            // 프레임 전송 setInterval ID
    private isConnected: boolean = false;                   // 연결 상태
    private isStreaming: boolean = false;                   // 스트리밍 상태
    private config: AIConnectionConfig;                     // 연결 구성 정보

    // 수신 핸들러 (텍스트, 바이너리)
    private binaryHandler: ((data: ArrayBuffer) => void) | null = null;
    private jsonHandler: ((data: WSMessageIn) => void) | null = null;

    // 키 검증 응답을 기다리는 Promise의 resolve/reject 저장
    private pendingVerifyResolve: ((v: WSMessageIn) => void) | null = null;
    private pendingVerifyReject: ((e: any) => void) | null = null;

    constructor(config: AIConnectionConfig) {
        this.config = config;
    }

    // 여러 후보 URL을 통해 서버 연결 가능 여부 테스트
    async testConnection(): Promise<{ success: boolean; url?: string; error?: string }> {
        const testUrls = [
            this.config.wsUrl,
            "ws://localhost:8000/ws/video",
            "ws://127.0.0.1:8000/ws",
            "ws://localhost:8000/ws",
            "ws://127.0.0.1:8000/video",
            "ws://localhost:8000/video",
        ];

        for (const url of testUrls) {
            try {
                const result = await this.testSingleUrl(url);
                if (result.success) return { success: true, url };
            } catch (error) {
                console.error(`Failed to test ${url}:`, error);
            }
        }

        return { success: false, error: "모든 AI 서버 URL 테스트 실패" };
    }

    // 단일 URL 테스트 함수
    private testSingleUrl(url: string): Promise<{ success: boolean }> {
        return new Promise((resolve) => {
            const testWs = new WebSocket(url);

            testWs.onopen = () => {
                testWs.close();
                resolve({ success: true });
            };

            testWs.onerror = () => resolve({ success: false });

            setTimeout(() => {
                testWs.close();
                resolve({ success: false });
            }, 3000);
        });
    }

    // 실제 연결을 수행하는 메서드
    async connect(): Promise<{ success: boolean; error?: string }> {
        try {
            this.ws = new WebSocket(this.config.wsUrl);
            this.ws.binaryType = "arraybuffer";

            return new Promise((resolve) => {
                if (!this.ws) return resolve({ success: false, error: "WebSocket 생성 실패" });

                this.ws.onmessage = (event: MessageEvent) => {
                    try {
                        if (typeof event.data === "string") {
                            const parsed: WSMessageIn = JSON.parse(event.data);
                            if (this.jsonHandler) this.jsonHandler(parsed);

                            // 키 검증 응답 처리
                            if (parsed.type === "verification_result" && this.pendingVerifyResolve) {
                                this.pendingVerifyResolve(parsed);
                                this.pendingVerifyResolve = null;
                                this.pendingVerifyReject = null;
                            }

                            // disconnect 결과
                            if (parsed.type === "disconnect_result") {
                                console.info("[🔌 DISCONNECT 결과]:", parsed);
                            }

                            // 자동 녹화 시작
                            if (parsed.type === "auto_recording_started") {
                                console.log("[🎥 자동 녹화 시작]:", parsed);
                                useAIStore.getState().startAutoRecording(parsed as AutoRecordingStarted);
                            }

                            // 자동 녹화 종료
                            if (parsed.type === "auto_recording_finalized") {
                                console.log("[📁 자동 녹화 종료]:", parsed);
                                useAIStore.getState().stopAutoRecording(parsed as AutoRecordingFinalized);
                            }

                            return;
                        }

                        // 바이너리 프레임 처리
                        if (event.data instanceof ArrayBuffer && this.binaryHandler) {
                            this.binaryHandler(event.data);
                            return;
                        }

                        // Blob 처리
                        if (event.data instanceof Blob) {
                            event.data.arrayBuffer().then((buf) => {
                                if (this.binaryHandler) this.binaryHandler(buf);
                            });
                        }
                    } catch (e) {
                        console.error("📛 WS 메시지 파싱 오류:", e);
                    }
                };

                this.ws.onopen = () => {
                    this.isConnected = true;
                    resolve({ success: true });
                };

                this.ws.onerror = (error) => {
                    console.error("AI server WebSocket error:", error);
                    this.isConnected = false;
                    if (this.pendingVerifyReject) {
                        this.pendingVerifyReject(error);
                        this.pendingVerifyResolve = null;
                        this.pendingVerifyReject = null;
                    }
                    resolve({ success: false, error: "AI 서버 연결 오류" });
                };

                this.ws.onclose = () => {
                    this.isConnected = false;
                    this.isStreaming = false;
                    if (this.pendingVerifyReject) {
                        this.pendingVerifyReject(new Error("WebSocket closed"));
                        this.pendingVerifyResolve = null;
                        this.pendingVerifyReject = null;
                    }
                };
            });
        } catch (error) {
            return { success: false, error: "연결 시도 중 오류 발생" };
        }
    }

    // 외부에서 메시지 수신 핸들러 설정
    onBinaryMessage(handler: (data: ArrayBuffer) => void) {
        this.binaryHandler = handler;
    }

    onJsonMessage(handler: (data: WSMessageIn) => void) {
        this.jsonHandler = handler;
    }

    // 안전한 JSON 송신 유틸
    private sendJSON(payload: WSMessageOut): { success: boolean; error?: string } {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return { success: false, error: "WebSocket이 연결되지 않았습니다" };
        }
        try {
            this.ws.send(JSON.stringify(payload));
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e?.message || "메시지 전송 실패" };
        }
    }

    // 모자이크 복호화 요청 처리 (키 검증)
    requestDecryption(accessToken: string, cameraId: string, timeoutMs: number = 5000): Promise<WSMessageIn> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return Promise.reject(new Error("WebSocket이 연결되지 않았습니다"));
        }

        if (this.pendingVerifyReject) {
            this.pendingVerifyReject(new Error("새로운 검증 요청으로 이전 요청 취소"));
            this.pendingVerifyResolve = null;
            this.pendingVerifyReject = null;
        }

        const sendRes = this.sendJSON({ type: "key_verification", accessToken, cameraId });
        if (!sendRes.success) return Promise.reject(new Error(sendRes.error || "전송 실패"));

        return new Promise<WSMessageIn>((resolve, reject) => {
            this.pendingVerifyResolve = resolve;
            this.pendingVerifyReject = reject;

            const to = setTimeout(() => {
                if (this.pendingVerifyReject) {
                    this.pendingVerifyReject(new Error("검증 응답 타임아웃"));
                }
                this.pendingVerifyResolve = null;
                this.pendingVerifyReject = null;
            }, timeoutMs);

            const origResolve = this.pendingVerifyResolve;
            this.pendingVerifyResolve = (msg) => {
                clearTimeout(to);
                origResolve?.(msg);
            };
        });
    }

    // 서버에 disconnect 메시지를 보낸 후 연결 종료
    async requestDisconnect(timeoutMs: number = 3000): Promise<WSMessageIn | null> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return null;

        try {
            const sendRes = this.sendJSON({ type: "disconnect" });
            if (!sendRes.success) throw new Error(sendRes.error || "disconnect 전송 실패");

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
                    this.jsonHandler = prevHandler || null;
                    resolve(captured);
                }, timeoutMs);
            });
        } catch (e) {
            console.error("requestDisconnect error:", e);
            return null;
        }
    }

    // 영상 요소로부터 프레임을 캡처해 전송 시작
    startFrameTransmission(
        videoElement: HTMLVideoElement,
        onFrameSent?: (size: number) => void,
        onFrameReceived?: (data: ArrayBuffer) => void
    ): { success: boolean; error?: string } {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return { success: false, error: "WebSocket이 연결되지 않았습니다" };
        }
        if (this.isStreaming) {
            return { success: false, error: "이미 스트리밍 중입니다" };
        }

        if (onFrameReceived) {
            this.onBinaryMessage(onFrameReceived);
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return { success: false, error: "캔버스 컨텍스트 생성 실패" };

        const sendFrame = () => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !videoElement) return;

            if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0 && videoElement.readyState >= 2) {
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

        return { success: true };
    }

    // 프레임 전송 종료
    stopFrameTransmission(): void {
        if (this.frameInterval) {
            clearInterval(this.frameInterval);
            this.frameInterval = null;
        }
        this.isStreaming = false;
    }

    // 전체 WebSocket 연결 종료
    async disconnect(): Promise<void> {
        this.stopFrameTransmission();

        try {
            await this.requestDisconnect(1000);
        } catch {}

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
        this.isStreaming = false;

        if (this.pendingVerifyReject) {
            this.pendingVerifyReject(new Error("Disconnected"));
            this.pendingVerifyResolve = null;
            this.pendingVerifyReject = null;
        }
    }

    // 현재 연결 및 스트리밍 상태 반환
    getStatus(): { isConnected: boolean; isStreaming: boolean } {
        return { isConnected: this.isConnected, isStreaming: this.isStreaming };
    }
}

// 기본 설정값 (개발용)
export const DEFAULT_AI_CONFIG: AIConnectionConfig = {
    wsUrl: 'ws://localhost:8000/ws/video',
    frameRate: 10,
    quality: 0.8
};
