// AI 관련 API 서비스
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
          return { success: true, url };
        }
      } catch (error) {
        console.error(`Failed to test ${url}:`, error);
      }
    }

    return { success: false, error: "모든 AI 서버 URL 테스트 실패" };
  }

  private testSingleUrl(url: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      const testWs = new WebSocket(url);
      
      testWs.onopen = () => {
        testWs.close();
        resolve({ success: true });
      };
      
      testWs.onerror = () => {
        resolve({ success: false });
      };
      
      // 3초 타임아웃
      setTimeout(() => {
        testWs.close();
        resolve({ success: false });
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
          resolve({ success: false, error: "WebSocket 생성 실패" });
          return;
        }

        this.ws.onopen = () => {
          this.isConnected = true;
          resolve({ success: true });
        };

        this.ws.onerror = (error) => {
          console.error("AI server WebSocket error:", error);
          this.isConnected = false;
          resolve({ success: false, error: "AI 서버 연결 오류" });
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.isStreaming = false;
        };
      });
    } catch (error) {
      return { success: false, error: "연결 시도 중 오류 발생" };
    }
  }

  // 프레임 전송 시작
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

    // 프레임 수신 핸들러 설정
    if (onFrameReceived) {
      this.ws.onmessage = (event) => {
        onFrameReceived(event.data);
      };
    }

    // 캔버스 생성
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { success: false, error: "캔버스 컨텍스트 생성 실패" };
    }

    const sendFrame = () => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !videoElement) return;

      // 비디오가 준비되었는지 확인
      if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0 && 
          videoElement.readyState >= 2) { // HAVE_CURRENT_DATA 이상
        try {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob && this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(blob);
                if (onFrameSent) {
                  onFrameSent(blob.size);
                }
              }
            },
            'image/jpeg',
            this.config.quality
          );
        } catch (error) {
          console.error('프레임 캡처 오류:', error);
        }
      }
    };

    // 프레임 전송 간격 설정
    this.frameInterval = window.setInterval(sendFrame, 1000 / this.config.frameRate);
    this.isStreaming = true;

    return { success: true };
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
  disconnect(): void {
    this.stopFrameTransmission();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.isStreaming = false;
  }

  // 상태 확인
  getStatus(): { isConnected: boolean; isStreaming: boolean } {
    return {
      isConnected: this.isConnected,
      isStreaming: this.isStreaming
    };
  }
}

// 복호화 서비스
export class DecryptService {
  private static readonly VALID_KEYS = ['admin123', 'master2024', 'secure789'];
  private static readonly ALGORITHM = 'AES-256-GCM';

  // 복호화키 검증
  static validateKey(key: string): { valid: boolean; error?: string } {
    if (!key.trim()) {
      return { valid: false, error: '복호화키를 입력해주세요.' };
    }

    if (!this.VALID_KEYS.includes(key)) {
      return { valid: false, error: '잘못된 복호화키입니다.' };
    }

    return { valid: true };
  }

  // 복호화 설정 가져오기
  static getDecryptConfig(key: string): DecryptConfig | null {
    const validation = this.validateKey(key);
    if (!validation.valid) {
      return null;
    }

    return {
      key,
      algorithm: this.ALGORITHM
    };
  }

  // 복호화 상태 확인
  static isDecrypted(key: string): boolean {
    return this.VALID_KEYS.includes(key);
  }
}

// 기본 설정
export const DEFAULT_AI_CONFIG: AIConnectionConfig = {
  wsUrl: "ws://127.0.0.1:8000/ws/video",
  frameRate: 10, // 10fps
  quality: 0.8   // JPEG 품질
};

// 싱글톤 인스턴스
export const aiService = new AIService(DEFAULT_AI_CONFIG);
export const decryptService = new DecryptService(); 