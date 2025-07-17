import React, { useRef, useEffect, useState } from 'react';

interface CameraFeedProps {
  decrypted?: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ decrypted = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const getUserCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("카메라 접근 오류:", err);
        setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
      }
    };

    getUserCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '100%',
            maxWidth: '600px',
            border: '1px solid black',
            borderRadius: 12,
            filter: decrypted ? 'none' : 'blur(12px)',
            background: '#222'
          }}
        />
      )}
      <span style={{ marginTop: 8, color: '#aaa', fontSize: 14 }}>
        {decrypted ? '복호화된 영상입니다.' : '모자이크 처리된 영상입니다.'}
      </span>
    </div>
  );
};

export default CameraFeed;