import { useState, useEffect } from 'react';
import modalStyles from './PromotionRequestModal.module.css';
import tableStyles from '../../pages/SettingsPage.module.css';
import useAdminRequestStore from '../../stores/adminrequestStore';

/**
 * 일반 유저의 MODERATOR 승격 요청 및 내 요청 현황을 보여주는 모달 컴포넌트입니다.
 * - 요청 생성, 내 요청 목록/상세, 대기중 개수, 에러 처리 등 제공
 */
interface Props {
  open: boolean;
  onClose: () => void;
}

const PromotionRequestModal = ({ open, onClose }: Props) => {
  // 요청 제목/설명 입력 상태
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDesc, setRequestDesc] = useState('');

  // zustand store에서 요청 관련 상태/함수 가져오기
  const {
    requests: myRequests,
    selectedRequest: mySelectedRequest,
    pendingCount,
    loading: myLoading,
    error: myError,
    fetchRequests: fetchMyRequests,
    fetchRequestDetail: fetchMyRequestDetail,
    fetchPendingCount,
    createRequest,
    clearError: clearMyError,
    clearSelected: clearMySelected,
  } = useAdminRequestStore();

  // 모달 열릴 때 내 요청 목록/대기중 개수 불러오기
  useEffect(() => {
    if (open) {
      fetchMyRequests();
      fetchPendingCount();
    }
    // eslint-disable-next-line
  }, [open]);

  // 승격 요청 제출
  const handleSubmitRequest = async () => {
      if (!requestTitle.trim() || !requestDesc.trim()) {
          console.log('⚠️ 제목 또는 설명이 비어있음');
          return;
      }
      console.log('📤 요청 제출 버튼 클릭됨');
      await createRequest({ title: requestTitle, description: requestDesc });
      console.log('✅ 요청 전송 완료');
    setRequestTitle('');
    setRequestDesc('');
    await fetchMyRequests();
    await fetchPendingCount();
  };

  if (!open) return null;

  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div
        className={modalStyles.modal}
        onClick={e => e.stopPropagation()}
      >
        <h2 className={modalStyles.title}>MODERATOR 승격 요청</h2>
        <div className={modalStyles.form}>
          <label>제목</label>
          <input
            className={modalStyles.input}
            value={requestTitle}
            onChange={e => setRequestTitle(e.target.value)}
            placeholder="요청 제목"
          />
          <label>설명</label>
          <textarea
            className={modalStyles.textarea}
            value={requestDesc}
            onChange={e => setRequestDesc(e.target.value)}
            placeholder="요청 상세 설명"
          />
          <button
            className={modalStyles.submitButton}
            disabled={myLoading || !requestTitle.trim() || !requestDesc.trim()}
            onClick={handleSubmitRequest}
          >
            요청 제출
          </button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>내 대기중 요청 개수:</b> {pendingCount}
        </div>
        {myError && (
          <div className={modalStyles.error}>
            {myError}
            <button onClick={clearMyError} className={modalStyles.errorClose}>닫기</button>
          </div>
        )}
        {/* 내 요청 목록 테이블 */}
        <div className={tableStyles.adminDashboardTableWrapper} style={{ marginBottom: 16 }}>
          <table className={tableStyles.adminDashboardTable}>
            <thead>
              <tr>
                <th>ID</th>
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
                  className={mySelectedRequest?.id === req.id ? tableStyles.adminDashboardRowSelected : undefined}
                >
                  <td>{req.id}</td>
                  <td>{req.title}</td>
                  <td className={
                    req.status === 'PENDING'
                      ? tableStyles.adminDashboardStatusPending
                      : req.status === 'APPROVED'
                        ? tableStyles.adminDashboardStatusApproved
                        : tableStyles.adminDashboardStatusRejected
                  }>
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
        {/* 내 요청 상세 */}
        {mySelectedRequest && (
          <div className={tableStyles.adminDashboardDetail}>
            <h4>요청 상세</h4>
            <div style={{ marginBottom: 8 }}>ID: {mySelectedRequest.id}</div>
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
