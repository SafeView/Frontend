import { useState, useCallback, useEffect, useRef } from 'react';

interface UseCameraReturn {
  stream: MediaStream | null;
  error: string | null;
  isLoading: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  checkPermission: () => Promise<void>;
  retryCamera: () => Promise<void>;
}

export const useCamera = (): UseCameraReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isStartingRef = useRef(false);

  const startCamera = useCallback(async () => {
    // 이미 시작 중이거나 스트림이 있으면 중복 시작 방지
    if (isStartingRef.current || stream) {
      console.log('카메라 시작 중이거나 이미 스트림이 존재합니다.');
      return;
    }

    isStartingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("이 브라우저는 카메라 접근을 지원하지 않습니다.");
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('사용 가능한 비디오 장치:', videoDevices);
      
      if (videoDevices.length === 0) {
        throw new Error("카메라가 연결되어 있지 않습니다.");
      }

      let constraints: MediaStreamConstraints = { video: true, audio: false };
      let mediaStream: MediaStream;
      
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (basicError: any) {
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
      
      setStream(mediaStream);
      setIsLoading(false);
      isStartingRef.current = false;
      console.log('카메라 스트림 시작 성공');
      
    } catch (err: any) {
      console.error("카메라 접근 오류:", err);
      
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
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('카메라 스트림 정리:', track.label);
        track.stop();
      });
      setStream(null);
    }
  }, [stream]);

  const checkPermission = useCallback(async () => {
    try {
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
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('비디오 장치 목록:', videoDevices);
      
    } catch (err) {
      console.log('권한 API 지원 안됨, 직접 시도');
      startCamera();
    }
  }, [startCamera]);

  const retryCamera = useCallback(async () => {
    console.log('카메라 재시도 시작');
    stopCamera();
    // 잠시 대기 후 다시 시작
    setTimeout(() => {
      startCamera();
    }, 100);
  }, [stopCamera, startCamera]);

  // 컴포넌트 마운트 시 카메라 자동 시작
  useEffect(() => {
    console.log('useCamera 훅 마운트 - 카메라 시작');
    startCamera();
  }, [startCamera]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      console.log('useCamera 훅 언마운트 - 카메라 정리');
      stopCamera();
    };
  }, [stopCamera]);

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