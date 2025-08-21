import { useState, useCallback, useEffect, useRef } from 'react';

// 커스텀 훅 반환 타입 정의
interface UseCameraReturn {
    stream: MediaStream | null;               // 현재 카메라 스트림
    error: string | null;                     // 에러 메시지
    isLoading: boolean;                       // 로딩 상태
    startCamera: () => Promise<void>;         // 카메라 시작 함수
    stopCamera: () => void;                   // 카메라 중지 함수
    checkPermission: () => Promise<void>;     // 카메라 권한 확인 함수
    retryCamera: () => Promise<void>;         // 카메라 재시도 함수
}

export const useCamera = (): UseCameraReturn => {
    const [stream, setStream] = useState<MediaStream | null>(null);      // 현재 미디어 스트림 상태
    const [error, setError] = useState<string | null>(null);             // 오류 메시지 상태
    const [isLoading, setIsLoading] = useState(false);                   // 로딩 상태
    const isStartingRef = useRef(false);                                 // 중복 호출 방지용 ref (렌더링과 무관)

    // 📸 카메라 시작 함수
    const startCamera = useCallback(async () => {
        // 이미 시작 중이거나 스트림이 있으면 중복 실행 방지
        if (isStartingRef.current || stream) {
            console.log('카메라 시작 중이거나 이미 스트림이 존재합니다.');
            return;
        }

        isStartingRef.current = true;
        setIsLoading(true);
        setError(null);

        try {
            // 브라우저가 mediaDevices API를 지원하지 않는 경우
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("이 브라우저는 카메라 접근을 지원하지 않습니다.");
            }

            // 사용 가능한 장치 목록 조회
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            console.log('사용 가능한 비디오 장치:', videoDevices);

            if (videoDevices.length === 0) {
                throw new Error("카메라가 연결되어 있지 않습니다.");
            }

            // 기본 제약 조건으로 시도
            let constraints: MediaStreamConstraints = { video: true, audio: false };
            let mediaStream: MediaStream;

            try {
                // 기본 설정으로 스트림 요청
                mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (basicError: any) {
                // 기본 실패 시 상세한 제약 조건으로 재시도
                console.log("기본 설정 실패, 상세 설정으로 재시도:", basicError);

                constraints = {
                    video: {
                        width: { min: 320, ideal: 640, max: 1920 },
                        height: { min: 240, ideal: 480, max: 1080 },
                        frameRate: { min: 15, ideal: 30, max: 60 }
                    },
                    audio: false
                };

                mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            }

            // 스트림 성공적으로 획득
            setStream(mediaStream);
            setIsLoading(false);
            isStartingRef.current = false;
            console.log('카메라 스트림 시작 성공');

        } catch (err: any) {
            console.error("카메라 접근 오류:", err);

            // 에러 종류에 따른 메시지 분기
            let errorMessage = "오류 발생: ";
            if (err.name === 'NotAllowedError') {
                errorMessage += "카메라 접근이 거부되었습니다. 브라우저에서 카메라 권한을 허용해주세요.";
            } else if (err.name === 'NotFoundError') {
                errorMessage += "카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.";
            } else if (err.name === 'NotSupportedError') {
                errorMessage += "이 브라우저는 카메라 접근을 지원하지 않습니다.";
            } else if (err.name === 'NotReadableError') {
                errorMessage += "카메라가 다른 애플리케이션에서 사용 중입니다.";
            } else {
                errorMessage += err.message;
            }

            setError(errorMessage);
            setIsLoading(false);
            isStartingRef.current = false;
        }
    }, [stream]);

    // 🛑 카메라 중지 함수
    const stopCamera = useCallback(() => {
        if (stream) {
            // 모든 트랙 중지
            stream.getTracks().forEach(track => {
                console.log('카메라 스트림 정리:', track.label);
                track.stop();
            });
            setStream(null);
        }
    }, [stream]);

    // 🔐 카메라 권한 확인 함수
    const checkPermission = useCallback(async () => {
        try {
            // permissions API 지원 여부 확인
            if ('permissions' in navigator) {
                const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
                console.log('Camera permission state:', result.state);

                if (result.state === 'granted') {
                    console.log("카메라 권한이 허용되어 있습니다.");
                } else if (result.state === 'denied') {
                    console.log("카메라 권한이 거부되었습니다.");
                } else {
                    console.log("카메라 권한을 요청해야 합니다.");
                }
            } else {
                console.log("권한 API를 지원하지 않는 브라우저입니다.");
            }

            // 장치 목록도 출력
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            console.log('비디오 장치 목록:', videoDevices);

        } catch (err) {
            console.log('권한 API 지원 안됨, 직접 시도');
            // 실패하면 카메라 직접 시작 시도
            startCamera();
        }
    }, [startCamera]);

    // 🔁 카메라 재시도 함수
    const retryCamera = useCallback(async () => {
        console.log('카메라 재시도 시작');
        stopCamera();
        // 약간의 지연 후 다시 시작
        setTimeout(() => {
            startCamera();
        }, 100);
    }, [stopCamera, startCamera]);

    // 📦 마운트 시 자동 카메라 시작
    useEffect(() => {
        console.log('useCamera 훅 마운트 - 카메라 시작');
        startCamera();
    }, [startCamera]);

    // 🧹 언마운트 시 카메라 정리
    useEffect(() => {
        return () => {
            console.log('useCamera 훅 언마운트 - 카메라 정리');
            stopCamera();
        };
    }, [stopCamera]);

    // 💡 훅 반환
    return {
        stream,
        error,
        isLoading,
        startCamera,
        stopCamera,
        checkPermission,
        retryCamera
    };
};
