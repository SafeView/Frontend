// import React, { useState } from 'react';
// import useUserStore  from '../../stores/userStore';
// import useKeyStore from '../../stores/keyStore';
// import CameraFeed from './CameraFeed';
// import styles from './CCTVViewer.module.css';
//
// interface CCTVViewerProps {
//   cameraId: number;
//   cameraName: string;
//   location: string;
// }
//
// const CCTVViewer: React.FC<CCTVViewerProps> = ({ cameraId, cameraName, location }) => {
//     const { user, isDecrypted, decryptionKey, setDecryptionKey, toggleDecryption } = useUserStore();
//     const { keyInfo, verifyResult, fetchKey, verifyKey, loading, error } = useKeyStore(); // ✅ 키 관련 상태
//     const [showKeyInput, setShowKeyInput] = useState(false);
//     const [tempKey, setTempKey] = useState('');
//
//   //const isAdmin = user?.role === 'ADMIN';
//   const isQualified = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
//   const isWebCam = cameraName === 'Web Cam';
//
//     const handleKeySubmit = async () => {
//         if (!tempKey.trim()) return;
//
//         try {
//             await verifyKey({
//                 cameraId,
//                 accessToken: tempKey.trim(), // ✅ 입력한 키로 검증 시도
//             });
//
//             if (verifyResult?.valid) {
//                 setDecryptionKey(tempKey); // ✅ 복호화 키 저장
//                 toggleDecryption(); // ✅ 영상 복호화
//                 setShowKeyInput(false);
//                 setTempKey('');
//             } else {
//                 alert('복호화 키가 유효하지 않습니다.');
//             }
//         } catch (err) {
//             alert('복호화 중 오류가 발생했습니다.');
//         }
//     };
//
//
//     const handleDecryptToggle = () => {
//         if (isDecrypted) {
//             toggleDecryption();
//         } else {
//             setShowKeyInput(true);
//         }
//     };
//
//     // ✅ 키 발급 버튼 클릭 시
//     const handleIssueKey = async () => {
//         try {
//             await fetchKey();
//             if (keyInfo) {
//                 alert(`복호화 키가 발급되었습니다: ${keyInfo.accessToken}`);
//                 setTempKey(keyInfo.accessToken); // 자동 입력
//                 setShowKeyInput(true); // 입력창 자동 열기
//             }
//         } catch (err) {
//             alert('키 발급에 실패했습니다.');
//         }
//     };
//
//   return (
//     <div className={styles.container}>
//       {/* 카메라 정보 헤더 */}
//       <div className={styles.cameraHeader}>
//         <div className={styles.cameraInfo}>
//           <h2 className={styles.cameraTitle}>{cameraName} - Live View</h2>
//           <span className={styles.location}>{location}</span>
//         </div>
//
//           {/* 어드민 전용 복호화 컨트롤 */}
//           {isQualified && (
//               <div className={styles.adminControls}>
//                   {/* ✅ 복호화 버튼 */}
//                   <button
//                       className={`${styles.decryptBtn} ${isDecrypted ? styles.active : ''}`}
//                       onClick={handleDecryptToggle}
//                   >
//                       {isDecrypted ? '복호화됨' : '복호화'}
//                   </button>
//
//                   {/* ✅ 키 발급 버튼 */}
//                   <button className={styles.issueKeyBtn} onClick={handleIssueKey} disabled={loading}>
//                       {loading ? '발급 중...' : '키 발급'}
//                   </button>
//               </div>
//           )}
//       </div>
//
//         {/* 복호화키 입력 모달 */}
//         {showKeyInput && (
//             <div className={styles.keyModal}>
//                 <div className={styles.keyModalContent}>
//                     <h3>복호화키 입력</h3>
//                     <p>모자이크가 해제된 영상을 보려면 복호화키를 입력하세요.</p>
//                     <input
//                         type="password"
//                         value={tempKey}
//                         onChange={(e) => setTempKey(e.target.value)}
//                         placeholder="복호화키를 입력하세요"
//                         className={styles.keyInput}
//                         onKeyPress={(e) => e.key === 'Enter' && handleKeySubmit()}
//                     />
//                     <div className={styles.keyModalButtons}>
//                         <button onClick={handleKeySubmit} className={styles.submitBtn}>
//                             확인
//                         </button>
//                         <button onClick={() => setShowKeyInput(false)} className={styles.cancelBtn}>
//                             취소
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         )}
//
//
//         {/* 영상 표시 영역 */}
//       <div className={styles.videoArea}>
//         {isWebCam ? (
//           // Web Cam은 AI 처리된 영상 표시
//           <CameraFeed enableAI={true} decrypted={isDecrypted} />
//         ) : (
//           // 일반 CCTV는 모자이크 처리된 영상 표시
//           <div className={styles.cctvContainer}>
//             <video
//               src={`/videos/cam${cameraId}.mp4`}
//               className={`${styles.cctvVideo} ${isDecrypted ? '' : styles.mosaic}`}
//               controls
//               autoPlay
//               muted
//               loop
//             />
//             {!isDecrypted && (
//               <div className={styles.mosaicOverlay}>
//                 <div className={styles.mosaicMessage}>
//                   <span>모자이크 처리됨</span>
//                   {isQualified && (
//                     <p>복호화키를 입력하여 원본 영상을 확인하세요.</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//
//       {/* 상태 표시 */}
//       <div className={styles.statusBar}>
//         <span className={styles.cameraStatus}>
//           {cameraName} | {isDecrypted ? '복호화됨' : '모자이크 처리됨'}
//         </span>
//         {isQualified && (
//           <span className={styles.adminStatus}>
//               {user?.role} 권한
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default CCTVViewer;
