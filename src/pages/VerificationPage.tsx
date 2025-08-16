import { useEffect, useState } from 'react';
import styles from './VerificationPage.module.css';
import useKeyStore from '../stores/keyStore';
import useUserStore from '../stores/userStore';
import useAdminStore from '../stores/adminStore';
import PromotionRequestModal from '../components/Setting/PromotionRequestModal';
import {useUIStore} from "../stores/uiStore.ts";

const VerificationPage = () => {
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const { user } = useUserStore();
    const isAdmin = user?.role === 'ADMIN';
    const isModerator = user?.role === 'MODERATOR';
    const isUser = user?.role === 'USER';

    const [showRequestModal, setShowRequestModal] = useState(false);

    const {
        keyInfo,
        loading: keyLoading,
        error: keyError,
        fetchKey,
        verifyKey,
        verifyResult,
        clearError: clearKeyError,
    } = useKeyStore();

    const {
        requests,
        pendingRequests,
        selectedRequest,
        //loading,
        //error,
        fetchRequests,
        fetchPendingRequests,
        fetchRequestById,
        approveRequest,
        rejectRequest,
        //clearError,
        clearSelected,
    } = useAdminStore();

    useEffect(() => {
        if (isAdmin) {
            fetchRequests();
            fetchPendingRequests();
        }
    }, [isAdmin]);

    return (
        <div className={styles.container}
             style={{ marginLeft: isSidebarOpen ? "0px" : "50px" }}
        >
            <h1 className={styles.title}>🔐 인증 및 권한 검증</h1>

            {/* 🔑 어드민 / 모더레이터만 키 발급 가능 */}
            {(isAdmin || isModerator) && (
                <section className={styles.section}>
                    <h3>🔑 복호화 키 관리</h3>
                    <button onClick={fetchKey} disabled={keyLoading}>
                        {keyLoading ? '키 발급 중...' : '키 발급'}
                    </button>
                    <button
                        onClick={() => {
                            if (!keyInfo?.accessToken) return alert('먼저 키를 발급받으세요.');
                            verifyKey({ accessToken: keyInfo.accessToken, cameraId: 'CAMERA_001' });
                        }}
                    >
                        키 검증
                    </button>
                    {keyInfo && <p>발급된 키: {keyInfo.accessToken}</p>}
                    {verifyResult && <p style={{ color: 'green' }}>✅ 키 검증 성공</p>}
                    {keyError && (
                        <div style={{ color: 'red' }}>
                            ⚠️ {keyError}
                            <button onClick={clearKeyError}>닫기</button>
                        </div>
                    )}
                </section>
            )}

            {/* 🙋‍♂️ 일반 유저는 승격 요청만 가능 */}
            {isUser && (
                <section className={styles.section}>
                    <h3>🙋 승격 요청</h3>
                    <button onClick={() => setShowRequestModal(true)}>승격 요청하기</button>
                </section>
            )}

            {/* 📋 어드민만 요청 관리 */}
            {isAdmin && (
                <section className={styles.section}>
                    <h3>📋 권한 요청 관리</h3>
                    <p>전체 요청 수: {requests.length}</p>
                    <p>대기중 요청 수: {pendingRequests.length}</p>
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

            {isUser && showRequestModal && (
                <PromotionRequestModal open={showRequestModal} onClose={() => setShowRequestModal(false)} />
            )}
        </div>
    );
};

export default VerificationPage;
