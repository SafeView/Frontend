// React 훅 import
import { useState, useEffect } from 'react';

// 스타일 모듈 import
import modalStyles from './PromotionRequestModal.module.css';
import tableStyles from '../../pages/SettingsPage.module.css';

// Zustand 스토어 import (승격 요청 관련 상태와 로직을 담고 있음)
import useAdminRequestStore from '../../stores/adminrequestStore';

/**
 * 일반 유저의 MODERATOR 승격 요청 및
 * 내 요청 현황을 보여주는 모달 컴포넌트
 */
interface Props {
    open: boolean;      // 모달 표시 여부
    onClose: () => void; // 모달 닫기 함수
}

// 컴포넌트 정의
const PromotionRequestModal = ({ open, onClose }: Props) => {
    // 입력 폼 상태
    const [requestTitle, setRequestTitle] = useState('');
    const [requestDesc, setRequestDesc] = useState('');

    // zustand store에서 요청 관련 상태/액션 가져오기
    const {
        requests: myRequests,               // 내가 요청한 목록
        selectedRequest: mySelectedRequest, // 선택된 요청 상세
        pendingCount,                       // 대기중 요청 개수
        loading: myLoading,
        error: myError,
        fetchRequests: fetchMyRequests,         // 내 요청 목록 가져오기
        fetchRequestDetail: fetchMyRequestDetail, // 상세 보기
        fetchPendingCount,                     // 대기 개수 가져오기
        createRequest,                         // 요청 생성
        clearError: clearMyError,
        clearSelected: clearMySelected,
    } = useAdminRequestStore();

    // 모달이 열릴 때, 내 요청 목록 및 대기 개수 갱신
    useEffect(() => {
        if (open) {
            fetchMyRequests();
            fetchPendingCount();
        }
        // eslint-disable-next-line
    }, [open]);

    // 요청 제출 핸들러
    const handleSubmitRequest = async () => {
        if (!requestTitle.trim() || !requestDesc.trim()) {
            console.log('⚠️ 제목과 설명을 모두 입력해주세요.');
            return;
        }

        try {
            console.log('📤 요청 제출 중...');
            await createRequest({ title: requestTitle, description: requestDesc });

            console.log('✅ 요청 성공');

            // 성공 시 에러 초기화
            clearMyError();
            setRequestTitle('');
            setRequestDesc('');

            // 목록 및 개수 갱신
            await fetchMyRequests();
            await fetchPendingCount();
        } catch (err: any) {
            console.error('🚨 요청 전송 실패:', err.message);
            // alert(err.message || '요청 전송 중 오류가 발생했습니다.');
        }
    };

    // 모달이 닫혀있다면 아무것도 렌더링하지 않음
    if (!open) return null;

    return (
        <div className={modalStyles.overlay} onClick={onClose}>
            <div
                className={modalStyles.modal}
                onClick={e => e.stopPropagation()} // 배경 클릭 시 닫히지 않도록 차단
            >
                {/* 제목 */}
                <h2 className={modalStyles.title}>MODERATOR 승격 요청</h2>

                {/* 입력 폼 */}
                <div className={modalStyles.form}>
                    <label>제목</label>
                    <input
                        className={modalStyles.input}
                        value={requestTitle}
                        onChange={e => setRequestTitle(e.target.value)}
                        placeholder="요청 제목"
                        disabled={myLoading}
                    />
                    <label>설명</label>
                    <textarea
                        className={modalStyles.textarea}
                        value={requestDesc}
                        onChange={e => setRequestDesc(e.target.value)}
                        placeholder="요청 상세 설명"
                        disabled={myLoading}
                    />
                    <button
                        className={modalStyles.submitButton}
                        disabled={myLoading || !requestTitle.trim() || !requestDesc.trim()}
                        onClick={handleSubmitRequest}
                    >
                        {myLoading ? '요청 중...' : '요청 제출'}
                    </button>
                </div>

                {/* 대기 중인 내 요청 개수 */}
                <div style={{ marginBottom: 16 }}>
                    <b>내 대기중 요청 개수:</b> {pendingCount}
                </div>

                {/* 에러 메시지 표시 */}
                {myError && (
                    <div className={modalStyles.error}>
                        {myError}
                        <button
                            onClick={clearMyError}
                            className={modalStyles.errorClose}
                        >
                            닫기
                        </button>
                    </div>
                )}

                {/* 요청 목록 테이블 */}
                <div className={tableStyles.adminDashboardTableWrapper} style={{ marginBottom: 16 }}>
                    <table className={tableStyles.adminDashboardTable}>
                        <thead>
                        <tr>
                            {/*<th>ID</th>*/}
                            <th>제목</th>
                            <th>상태</th>
                            <th>생성일</th>
                            <th>상세</th>
                        </tr>
                        </thead>
                        <tbody>
                        {myRequests.map((req) => (
                            <tr
                                key={req.id}
                                className={
                                    mySelectedRequest?.id === req.id
                                        ? tableStyles.adminDashboardRowSelected
                                        : undefined
                                }
                            >
                                {/*<td>{req.id}</td>*/}
                                <td>{req.title}</td>
                                <td
                                    className={
                                        req.status === 'PENDING'
                                            ? tableStyles.adminDashboardStatusPending
                                            : req.status === 'APPROVED'
                                                ? tableStyles.adminDashboardStatusApproved
                                                : tableStyles.adminDashboardStatusRejected
                                    }
                                >
                                    {req.status}
                                </td>
                                <td>{new Date(req.createdAt).toLocaleString()}</td>
                                <td>
                                    <button
                                        className={tableStyles.adminDashboardButton}
                                        onClick={() => fetchMyRequestDetail(req.id)}
                                    >
                                        보기
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 선택된 요청 상세 정보 */}
                {mySelectedRequest && (
                    <div className={tableStyles.adminDashboardDetail}>
                        <h4>요청 상세</h4>
                        {/*<div style={{ marginBottom: 8 }}>ID: {mySelectedRequest.id}</div>*/}
                        <div style={{ marginBottom: 8 }}>제목: {mySelectedRequest.title}</div>
                        <div style={{ marginBottom: 8 }}>상태: {mySelectedRequest.status}</div>
                        <div style={{ marginBottom: 8 }}>설명: {mySelectedRequest.description ?? '-'}</div>
                        <div style={{ marginBottom: 8 }}>생성일: {new Date(mySelectedRequest.createdAt).toLocaleString()}</div>
                        <div style={{ marginBottom: 8 }}>관리자 코멘트: {mySelectedRequest.adminComment ?? '-'}</div>
                        <button
                            className={tableStyles.adminDashboardButton}
                            style={{ marginTop: 8 }}
                            onClick={clearMySelected}
                        >
                            닫기
                        </button>
                    </div>
                )}

                {/* 모달 닫기 버튼 */}
                <button
                    className={modalStyles.closeButton}
                    onClick={onClose}
                >
                    모달 닫기
                </button>
            </div>
        </div>
    );
};

export default PromotionRequestModal;
