// src/pages/VerificationPage.tsx

import { useEffect, useState } from 'react';
import styles from './VerificationPage.module.css';

// ✅ 상태 관리 훅 (zustand 기반)
import useKeyStore from '../stores/keyStore';       // 키 발급/검증 관련 상태
import useUserStore from '../stores/userStore';     // 현재 로그인 사용자 정보
import useAdminStore from '../stores/adminStore';   // 어드민 권한 요청 관리 상태
import PromotionRequestModal from '../components/Setting/PromotionRequestModal'; // 일반 유저용 승격 요청 모달
import { useUIStore } from "../stores/uiStore.ts"; // 사이드바 열림 여부

const VerificationPage = () => {
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

    // 현재 로그인한 사용자 정보
    const { user } = useUserStore();
    const isAdmin = user?.role === 'ADMIN';
    const isModerator = user?.role === 'MODERATOR';
    const isUser = user?.role === 'USER';

    // 모달 열림 상태
    const [showRequestModal, setShowRequestModal] = useState(false);

    // ✅ 키 관련 store 훅
    const {
        keyInfo,            // 발급된 키 정보
        loading: keyLoading, // 키 발급 요청 중 여부
        error: keyError,    // 키 발급/검증 중 오류
        fetchKey,           // 키 발급 함수
        verifyKey,          // 키 검증 함수
        verifyResult,       // 키 검증 성공 여부
        clearError: clearKeyError, // 오류 초기화 함수
    } = useKeyStore();

    // ✅ 관리자 권한 요청 관리 store 훅
    const {
        requests,           // 모든 요청 목록
        pendingRequests,    // 대기 상태 요청 목록
        selectedRequest,    // 상세보기 중인 요청
        fetchRequests,      // 전체 요청 불러오기
        fetchPendingRequests, // 대기중 요청 불러오기
        fetchRequestById,   // 특정 요청 상세 가져오기
        approveRequest,     // 승인 처리
        rejectRequest,      // 거절 처리
        clearSelected,      // 상세보기 초기화
    } = useAdminStore();

    // ✅ 관리자 접근 시, 최초 요청 목록 불러오기
    useEffect(() => {
        if (isAdmin) {
            fetchRequests();
            fetchPendingRequests();
        }
    }, [isAdmin]);

    return (
        <div
            className={styles.container}
            style={{ marginLeft: isSidebarOpen ? "0px" : "50px" }} // 사이드바 닫힘 시 여백 확보
        >
            <h1 className={styles.title}>🔐 인증 및 권한 검증</h1>

            {/* 🔐 키 발급/검증 : 관리자 또는 중간관리자만 접근 가능 */}
            {(isAdmin || isModerator) && (
                <section className={styles.section}>
                    <h3>🔑 복호화 키 관리</h3>

                    {/* 키 발급 버튼 */}
                    <button onClick={fetchKey} disabled={keyLoading}>
                        {keyLoading ? '키 발급 중...' : '키 발급'}
                    </button>

                    {/* 키 검증 버튼 */}
                    <button
                        onClick={() => {
                            if (!keyInfo?.accessToken) return alert('먼저 키를 발급받으세요.');
                            verifyKey({ accessToken: keyInfo.accessToken, cameraId: 'CAMERA_001' }); // 예시 cameraId
                        }}
                    >
                        키 검증
                    </button>

                    {/* 발급된 키 정보 표시 */}
                    {keyInfo && (
                        <div className={styles.keyBox}>
                            <p>발급된 키: {keyInfo.accessToken}</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(keyInfo.accessToken)
                                        .then(() => alert('키가 복사되었습니다!'))
                                        .catch(() => alert('복사에 실패했습니다.'));
                                }}
                            >
                                복사
                            </button>
                        </div>
                    )}

                    {/* 검증 성공 결과 */}
                    {verifyResult && <p style={{ color: 'green' }}>✅ 유효한 키</p>}

                    {/* 오류 발생 시 메시지 */}
                    {keyError && (
                        <div style={{ color: 'red' }}>
                            ⚠️ {keyError}
                            <button onClick={clearKeyError}>닫기</button>
                        </div>
                    )}
                </section>
            )}

            {/* 🙋 일반 유저: 승격 요청만 가능 */}
            {isUser && (
                <section className={styles.section}>
                    <h3>🙋 승격 요청</h3>
                    <button onClick={() => setShowRequestModal(true)}>승격 요청하기</button>
                </section>
            )}

            {/* 📋 관리자: 권한 요청 관리 기능 */}
            {isAdmin && (
                <section className={styles.section}>
                    <h3>📋 권한 요청 관리</h3>
                    <p>전체 요청 수: {requests.length}</p>
                    <p>대기중 요청 수: {pendingRequests.length}</p>

                    {/* 요청 목록 테이블 */}
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>유저ID</th>
                            <th>제목</th>
                            <th>상태</th>
                            <th>생성일</th>
                            <th>액션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.userId}</td>
                                <td>{r.title}</td>
                                <td>{r.status}</td>
                                <td>{new Date(r.createdAt).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => fetchRequestById(r.id)}>보기</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 상세 보기 시 나타나는 패널 */}
                    {selectedRequest && (
                        <div className={styles.requestDetail}>
                            <p>제목: {selectedRequest.title}</p>
                            <p>설명: {selectedRequest.description}</p>
                            <p>상태: {selectedRequest.status}</p>
                            <div className={styles.actions}>
                                <button onClick={() => approveRequest(selectedRequest.id, '승인합니다.')}>승인</button>
                                <button onClick={() => rejectRequest(selectedRequest.id, '거절합니다.')}>거절</button>
                                <button onClick={clearSelected}>닫기</button>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* 🙋 승격 요청 모달 */}
            {isUser && showRequestModal && (
                <PromotionRequestModal
                    open={showRequestModal}
                    onClose={() => setShowRequestModal(false)}
                />
            )}
        </div>
    );
};

export default VerificationPage;
