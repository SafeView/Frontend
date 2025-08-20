import { useState, useCallback } from 'react';
import useUserStore from '../stores/userStore';
import type { AIService } from '../services/aiService'; // ✅ AIService 타입만 import

// 🔁 반환값 타입 정의
interface UseDecryptionReturn {
    showDecryptModal: boolean;                // 모달 표시 여부
    decryptKey: string;                       // 사용자가 입력한 복호화 키
    decryptError: string;                     // 에러 메시지
    isDecrypted: boolean;                     // 현재 복호화 상태 (모자이크 해제 여부)
    isAdmin: boolean;                         // 사용자 권한이 관리자
    isModerator: boolean;                     // 사용자 권한이 중간관리자
    handleDecryptSubmit: (cameraId: string) => Promise<void>; // 키 제출 처리 함수
    handleDecryptClick: () => void;           // 복호화 버튼 클릭 핸들러
    setShowDecryptModal: (show: boolean) => void; // 모달 상태 직접 제어 함수
    setDecryptKey: (key: string) => void;     // 복호화 키 직접 설정 함수
}

// 🔐 필요한 서비스 인터페이스만 추려서 타입 정의 (타입 최적화)
type DecryptionService = Pick<AIService, 'getStatus' | 'connect' | 'requestDecryption'>;

// 🧠 커스텀 훅 시작
export const useDecryption = (svc: DecryptionService): UseDecryptionReturn => {
    // 🏪 전역 사용자 상태
    const { user, isDecrypted, setDecryptionKey, toggleDecryption } = useUserStore();

    // 🎛️ 로컬 UI 상태
    const [showDecryptModal, setShowDecryptModal] = useState(false);  // 모달 표시 여부
    const [decryptKey, setDecryptKey] = useState('');                 // 복호화 키
    const [decryptError, setDecryptError] = useState('');             // 에러 메시지

    // 🔍 권한 표시용
    const isAdmin = user?.role === 'ADMIN';
    const isModerator = user?.role === 'MODERATOR';

    /**
     * ✅ 복호화 버튼 클릭 핸들러
     * - 이미 복호화 상태면 다시 토글해서 "재모자이크"
     * - 아니라면 키 입력 모달 표시
     */
    const handleDecryptClick = useCallback(() => {
        if (isDecrypted) {
            toggleDecryption(); // 이미 복호화 상태인 경우 → 다시 모자이크 처리
            setDecryptError('');
        } else {
            setShowDecryptModal(true); // 모달 열기
        }
    }, [isDecrypted, toggleDecryption]);

    /**
     * ✅ 복호화 키 제출 함수
     * - WS 연결이 없으면 connect() 시도
     * - 키 검증 메시지를 서버에 전송 → 응답 확인
     * - 성공 시: 상태 업데이트 + 모달 닫기
     */
    const handleDecryptSubmit = useCallback(
        async (cameraId: string) => {
            // 1. 키 비어있는지 확인
            if (!decryptKey.trim()) {
                setDecryptError('복호화키를 입력해주세요.');
                return;
            }

            setDecryptError(''); // 기존 에러 초기화

            try {
                // 2. WS 연결 상태 확인
                const status = svc.getStatus();
                if (!status.isConnected) {
                    const conn = await svc.connect();
                    if (!conn.success) {
                        setDecryptError(conn.error || 'AI 서버에 연결할 수 없습니다.');
                        return;
                    }
                }

                // 3. 키 검증 요청 전송 (타임아웃 8초)
                const res = await svc.requestDecryption(decryptKey, cameraId, 8000);

                // 4. 응답 유효성 확인
                const ok =
                    res?.type === 'verification_result' &&
                    res?.success === true &&
                    (res?.canDecrypt === true || res?.isValid === true);

                if (!ok) {
                    setDecryptError((res as any)?.message || '복호화키 검증 실패');
                    return;
                }

                // 5. 검증 성공 → 프론트 상태 변경
                setDecryptionKey(decryptKey);        // 입력한 키 저장 (향후 권한 기반 기능에 사용)
                if (!isDecrypted) toggleDecryption(); // 모자이크 해제
                setShowDecryptModal(false);          // 모달 닫기
                setDecryptKey('');                   // 키 입력 초기화
                setDecryptError('');                 // 에러 메시지 초기화
            } catch (e: any) {
                setDecryptError(e?.message || '검증 중 오류가 발생했습니다.');
            }
        },
        [decryptKey, isDecrypted, setDecryptionKey, toggleDecryption]
    );

    // ✨ 외부에서 이 훅을 사용할 때 접근할 수 있는 함수 및 상태 반환
    return {
        showDecryptModal,
        decryptKey,
        decryptError,
        isDecrypted,
        isAdmin,
        isModerator,
        handleDecryptSubmit,     // 카메라 ID를 받아 복호화 요청
        handleDecryptClick,      // 클릭 이벤트 처리
        setShowDecryptModal,
        setDecryptKey,
    };
};
