import { useState, useEffect } from 'react';
import styles from './SettingsPage.module.css';
import useAdminStore from '../stores/adminStore';
import useUserStore from '../stores/userStore.ts';
import useKeyStore from '../stores/keyStore';
import PromotionRequestModal from '../components/Setting/PromotionRequestModal';

const tabs = ['계정 정보', '시스템 설정', '알림 설정'];

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [showAdminDashboard, setShowAdminDashboard] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);

    // 유저 정보에서 role 확인 (어드민 여부)
    const { user } = useUserStore();

    const isAdmin = user?.role === 'ADMIN';
    const isModerator = user?.role === 'MODERATOR';
    const isUser = user?.role === 'USER';


    // 어드민 대시보드 관련 상태 및 함수
    const {
        requests,
        pendingRequests,
        selectedRequest,
        loading,
        error,
        fetchRequests,
        fetchPendingRequests,
        fetchRequestById,
        approveRequest,
        rejectRequest,
        clearError,
        clearSelected,
    } = useAdminStore();

    // ✅ 키 스토어 상태/함수 가져오기
    const {
        keyInfo,
        loading: keyLoading,
        error: keyError,
        fetchKey,
        verifyKey,
        verifyResult,
        clearError: clearKeyError,
    } = useKeyStore();


    // 어드민 대시보드 열릴 때 데이터 불러오기
    useEffect(() => {
        if (showAdminDashboard) {
            fetchRequests();
            fetchPendingRequests();
        }
        // eslint-disable-next-line
    }, [showAdminDashboard]);

    return (
        <div className={styles.container} style={{ height: '100vh', overflow: 'auto' }}>
            <h1 className={styles.title}>⚙️ Settings</h1>
            <p className={styles.subtitle}>시스템 및 계정 관련 설정을 수정할 수 있습니다.</p>

            <div className={styles.tabMenu}>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
                {isAdmin && (
                    <button
                        className={styles.tabButton}
                        style={{ marginLeft: 'auto', background: showAdminDashboard ? '#2a2e39' : undefined, color: showAdminDashboard ? 'white' : undefined }}
                        onClick={() => setShowAdminDashboard((v) => !v)}
                    >
                        관리자 설정
                    </button>
                )}
            </div>

            <div className={styles.tabContent}>
                {activeTab === '계정 정보' && (
                    <>
                        <h3>🙋‍♂️ 계정 정보</h3>
                        <label>이름</label>
                        <input type="text" placeholder="홍길동" />
                        <label>이메일</label>
                        <input type="email" placeholder="user@example.com" />
                        <label>비밀번호 변경</label>
                        <input type="password" placeholder="새 비밀번호" />
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            {isUser && (
                                <button
                                    className={styles.saveButton}
                                    style={{ background: '#4fc3f7', color: '#000', marginRight: 8 }}
                                    type="button"
                                    onClick={() => setShowRequestModal(true)}
                                >
                                    승격 요청
                                </button>
                            )}
                            <button className={styles.saveButton}>저장</button>
                        </div>
                        {/* ✅ 저장 버튼 바로 아래 복호화 키 UI */}
                        {(isAdmin || isModerator) && (
                            <div
                                style={{
                                    marginTop: '2rem',
                                    padding: '1rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    background: '#f9f9f9'
                                }}
                            >
                                <h4>🔑 복호화 키 관리</h4>
                                <p style={{ fontSize: '0.9rem', color: '#555' }}>
                                    카메라 데이터 복호화를 위해 키를 발급 및 검증할 수 있습니다.
                                </p>
                                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                    <button
                                        className={styles.saveButton}
                                        style={{ background: '#81c784' }}
                                        disabled={keyLoading}
                                        onClick={fetchKey}
                                    >
                                        {keyLoading ? '발급 중...' : '키 발급'}
                                    </button>
                                    <button
                                        className={styles.saveButton}
                                        style={{ background: '#64b5f6' }}
                                        onClick={() => {
                                            if (!keyInfo?.accessToken) {
                                                alert('먼저 키를 발급받으세요.');
                                                return;
                                            }
                                            verifyKey({ accessToken: keyInfo.accessToken, cameraId: 'CAMERA_001' });
                                            // 우선 카메라아이디는 CAMERA_001로 설정
                                        }}                                    >
                                        키 검증
                                    </button>
                                </div>

                                {keyInfo && (
                                    <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#333' }}>
                                        <strong>발급된 키:</strong> {keyInfo.accessToken}
                                    </div>
                                )}
                                {verifyResult && (
                                    <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'green' }}>
                                        ✅ 키 검증 성공
                                    </div>
                                )}
                                {keyError && (
                                    <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'red' }}>
                                        ⚠️ {keyError}
                                        <button
                                            onClick={clearKeyError}
                                            style={{
                                                marginLeft: 8,
                                                background: 'none',
                                                color: 'red',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            닫기
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {activeTab === '시스템 설정' && (
                    <>
                        <h3>🖥 시스템 설정</h3>
                        <label>테마</label>
                        <select>
                            <option>다크 모드</option>
                            <option>라이트 모드</option>
                        </select>
                        <label>언어</label>
                        <select>
                            <option>한국어</option>
                            <option>English</option>
                        </select>
                        <button className={styles.saveButton}>저장</button>
                    </>
                )}

                {activeTab === '알림 설정' && (
                    <>
                        <h3>🔔 알림 설정</h3>
                        <label>
                            <input type="checkbox" checked readOnly />
                            실시간 알림 받기
                        </label>
                        <label>
                            알림 민감도
                            <input type="range" min="1" max="10" defaultValue="5" />
                        </label>
                        <button className={styles.saveButton}>저장</button>
                    </>
                )}
            </div>

            {/* 어드민 대시보드: 버튼 클릭 시만 표시 */}
            {isAdmin && showAdminDashboard && (
                <div className={styles.adminDashboard} style={{ maxHeight: '60vh', minHeight: 300, overflowY: 'auto' }}>
                    <h2 style={{ marginBottom: '1rem' }}>어드민 권한 요청 대시보드</h2>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '2rem' }}>
                        <div>
                            <b>전체 요청 수:</b> {requests.length}
                        </div>
                        <div>
                            <b>대기중 요청 수:</b> {pendingRequests.length}
                        </div>
                    </div>
                    {error && (
                        <div style={{ color: '#ff5252', marginBottom: '1rem' }}>
                            {error}
                            <button onClick={clearError} style={{ marginLeft: 8, background: 'none', color: '#ff5252', border: 'none', cursor: 'pointer' }}>닫기</button>
                        </div>
                    )}
                    <div className={styles.adminDashboardTableWrapper}>
                        <table className={styles.adminDashboardTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>유저ID</th>
                                    <th>제목</th>
                                    <th>상태</th>
                                    <th>생성일</th>
                                    <th>상세</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr
                                        key={req.id}
                                        className={selectedRequest?.id === req.id ? styles.adminDashboardRowSelected : undefined}
                                    >
                                        <td>{req.id}</td>
                                        <td>{req.userId}</td>
                                        <td>{req.title}</td>
                                        <td className={
                                            req.status === 'PENDING'
                                                ? styles.adminDashboardStatusPending
                                                : req.status === 'APPROVED'
                                                    ? styles.adminDashboardStatusApproved
                                                    : styles.adminDashboardStatusRejected
                                        }>
                                            {req.status}
                                        </td>
                                        <td>{new Date(req.createdAt).toLocaleString()}</td>
                                        <td>
                                            <button
                                                className={styles.adminDashboardButton}
                                                onClick={() => fetchRequestById(req.id)}
                                            >
                                                보기
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* 상세 정보 */}
                    {selectedRequest && (
                        <div className={styles.adminDashboardDetail}>
                            <h4>요청 상세</h4>
                            <div style={{ marginBottom: 8 }}>ID: {selectedRequest.id}</div>
                            <div style={{ marginBottom: 8 }}>유저 ID: {selectedRequest.userId}</div>
                            <div style={{ marginBottom: 8 }}>제목: {selectedRequest.title}</div>
                            <div style={{ marginBottom: 8 }}>상태: {selectedRequest.status}</div>
                            <div style={{ marginBottom: 8 }}>설명: {selectedRequest.description ?? '-'}</div>
                            <div style={{ marginBottom: 8 }}>생성일: {new Date(selectedRequest.createdAt).toLocaleString()}</div>
                            <div style={{ marginBottom: 8 }}>관리자 코멘트: {selectedRequest.adminComment ?? '-'}</div>
                            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                                <button
                                    className={`${styles.adminDashboardButton} ${styles.adminDashboardButtonApprove}`}
                                    disabled={selectedRequest.status !== 'PENDING' || loading}
                                    onClick={async () => {
                                        await approveRequest(selectedRequest.id, '승인합니다.');
                                        clearSelected();
                                        fetchRequests();
                                        fetchPendingRequests();
                                    }}
                                >
                                    승인
                                </button>
                                <button
                                    className={`${styles.adminDashboardButton} ${styles.adminDashboardButtonReject}`}
                                    disabled={selectedRequest.status !== 'PENDING' || loading}
                                    onClick={async () => {
                                        await rejectRequest(selectedRequest.id, '거절합니다.');
                                        clearSelected();
                                        fetchRequests();
                                        fetchPendingRequests();
                                    }}
                                >
                                    거절
                                </button>
                                <button
                                    className={`${styles.adminDashboardButton} ${styles.adminDashboardButtonClose}`}
                                    onClick={clearSelected}
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 일반유저 승격 요청 모달 */}
            {isUser && showRequestModal && (
                <PromotionRequestModal open={showRequestModal} onClose={() => setShowRequestModal(false)} />
            )}
        </div>
    );
};

export default SettingsPage;
