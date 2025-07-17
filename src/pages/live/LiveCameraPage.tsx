import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CameraFeed from '../../components/CameraFeed';
import { useUserStore } from '../../stores/userStore';
import styles from './LiveCameraPage.module.css';

const cameraInfo = {
  cam1: { name: '현관 CCTV', location: '1층 현관' },
  cam2: { name: '주차장 CCTV', location: '지하 주차장' },
  cam3: { name: '복도 CCTV', location: '2층 복도' },
  cam4: { name: '엘리베이터 CCTV', location: '엘리베이터 내부' },
  cam5: { name: '창고 CCTV', location: '창고' },
};

const LiveCameraPage = () => {
  const { cameraId } = useParams();
  const navigate = useNavigate();
  const cam = cameraInfo[cameraId as keyof typeof cameraInfo];
  const user = useUserStore(state => state.user);

  const [key, setKey] = useState('');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isDecrypted, setIsDecrypted] = useState(false);

  const handleDecrypt = () => {
    if (input === '1234') {
      setIsDecrypted(true);
      setError('');
      setKey(input);
    } else {
      setError('복호화 키가 올바르지 않습니다.');
      setIsDecrypted(false);
    }
  };

  if (!cam) {
    return (
      <div style={{ color: 'white', padding: 40 }}>
        <h2>존재하지 않는 카메라입니다.</h2>
        <button onClick={() => navigate('/live')} className={styles.button} style={{ marginTop: 16 }}>목록으로 돌아가기</button>
      </div>
    );
  }

  const canDecrypt = user && (user.role === 'ADMIN' || user.role === 'POLICE');

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/live')} className={styles.backBtn}>{'< 목록으로'}</button>
      <h1 className={styles.title}>{cam.name}</h1>
      <div className={styles.location}>{cam.location}</div>
      <div className={styles.card}>
        <CameraFeed decrypted={isDecrypted} />
      </div>
      {canDecrypt ? (
        <div className={styles.decryptBox}>
          <input
            type="password"
            placeholder="복호화 키 입력"
            value={input}
            onChange={e => setInput(e.target.value)}
            className={styles.input}
            disabled={isDecrypted}
          />
          <button
            onClick={handleDecrypt}
            className={styles.button}
            disabled={isDecrypted}
          >
            {isDecrypted ? '복호화 완료' : '복호화'}
          </button>
          {error && <span className={styles.error}>{error}</span>}
          {isDecrypted && <span className={styles.success}>복호화 성공! 모자이크 없는 영상을 확인하세요.</span>}
        </div>
      ) : (
        <div className={styles.noAuth}>
          복호화 권한이 없습니다.<br />
          (경찰 또는 관리자만 복호화 기능을 사용할 수 있습니다)
        </div>
      )}
    </div>
  );
};

export default LiveCameraPage; 