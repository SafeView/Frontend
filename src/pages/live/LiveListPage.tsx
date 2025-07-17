import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LiveListPage.module.css';

const cameras = [
  { id: 'cam1', name: '현관 CCTV', location: '1층 현관', riskLevel: '위험', description: 'Person detected in restricted area' },
  { id: 'cam2', name: '주차장 CCTV', location: '지하 주차장', riskLevel: '정상', description: 'Unusual vehicle movement' },
  { id: 'cam3', name: '복도 CCTV', location: '2층 복도', riskLevel: '주의', description: 'Back door left open' },
  { id: 'cam4', name: '엘리베이터 CCTV', location: '엘리베이터 내부', riskLevel: '정상', description: 'Large group gathering' },
  { id: 'cam5', name: '창고 CCTV', location: '창고', riskLevel: '위험', description: 'Motion detected in warehouse' },
];

const riskClass = {
  위험: `${styles.indicatorDot} ${styles.indicatorRed}`,
  정상: `${styles.indicatorDot} ${styles.indicatorGreen}`,
  주의: `${styles.indicatorDot} ${styles.indicatorBlue}`,
};

const LiveListPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내가 볼 수 있는 CCTV</h1>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.trHead}>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Risk</th>
              <th className={styles.th}>Description</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {cameras.map((cam, i) => (
              <tr
                key={cam.id}
                className={`${styles.tr} ${i % 2 === 0 ? styles.trEven : styles.trOdd}`}
                onClick={() => navigate(`/live/${cam.id}`)}
              >
                <td className={`${styles.td} ${styles.tdName}`}>{cam.name}</td>
                <td className={styles.td}>{cam.location}</td>
                <td className={styles.td}>
                  <span className={riskClass[cam.riskLevel as keyof typeof riskClass]} />
                  {cam.riskLevel}
                </td>
                <td className={styles.td}>{cam.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveListPage; 