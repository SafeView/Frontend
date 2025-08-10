import { useState, useCallback } from 'react';
import useUserStore from '../stores/userStore';
import type { AIService } from '../services/aiService'; // 타입만 사용

interface UseDecryptionReturn {
    showDecryptModal: boolean;
    decryptKey: string;
    decryptError: string;
    isDecrypted: boolean;
    isAdmin: boolean;
    isModerator: boolean;
    handleDecryptSubmit: (cameraId: string) => Promise<void>; // ✅ 수정: cameraId 필요
    handleDecryptClick: () => void;
    setShowDecryptModal: (show: boolean) => void;
    setDecryptKey: (key: string) => void;
}
type DecryptionService = Pick<AIService, 'getStatus' | 'connect' | 'requestDecryption'>;

export const useDecryption = (svc: DecryptionService): UseDecryptionReturn => {
    const { user, isDecrypted, setDecryptionKey, toggleDecryption } = useUserStore();

    // UI 상태
    const [showDecryptModal, setShowDecryptModal] = useState(false);
    const [decryptKey, setDecryptKey] = useState('');
    const [decryptError, setDecryptError] = useState('');

    // 권한(표시용)
    const isAdmin = user?.role === 'ADMIN';
    const isModerator = user?.role === 'MODERATOR';

    /**
     * ✅ 복호화 버튼 클릭
     * - 이미 복호화 상태면 다시 토글(=재모자이크)
     * - 아니면 모달 오픈
     */
    const handleDecryptClick = useCallback(() => {
        if (isDecrypted) {
            toggleDecryption();           // ✅ 수정/유지
            setDecryptError('');
        } else {
            setShowDecryptModal(true);    // ✅ 수정/유지
        }
    }, [isDecrypted, toggleDecryption]);

    /**
     * ✅ 복호화 키 제출
     * - 명세대로: 같은 WS 연결로 JSON { type:"key_verification", accessToken, cameraId } 전송
     * - 응답: { type:"verification_result", success, canDecrypt/isValid ... }
     * - 성공 시 자동 모자이크 해제(서버) + 프론트 UI 토글
     */
    const handleDecryptSubmit = useCallback(
        async (cameraId: string) => {
            // 간단 유효성 체크
            if (!decryptKey.trim()) {
                setDecryptError('복호화키를 입력해주세요.');
                return;
            }

            setDecryptError('');

            try {
                // 1) WS 연결 보장
                const status = svc.getStatus();
                if (!status.isConnected) {
                    const conn = await svc.connect();
                    if (!conn.success) {
                        setDecryptError(conn.error || 'AI 서버에 연결할 수 없습니다.');
                        return;
                    }
                }

                // 2) 서버에 검증 요청
                const res = await svc.requestDecryption(decryptKey, cameraId, 8000); // ✅ 타임아웃 8초 예시

                // 3) 명세 기준 판정: success && (canDecrypt || isValid)
                const ok =
                    res?.type === 'verification_result' &&
                    res?.success === true &&
                    (res?.canDecrypt === true || res?.isValid === true);

                if (!ok) {
                    setDecryptError((res as any)?.message || '복호화키 검증 실패');
                    return;
                }

                // 4) 성공: 프론트 상태 토글 + 키 저장 + 모달 닫기
                setDecryptionKey(decryptKey);    // ✅ 복호화에 사용된 키 유지(권한 체크/표시 용도)
                if (!isDecrypted) toggleDecryption();
                setShowDecryptModal(false);
                setDecryptKey('');
                setDecryptError('');
            } catch (e: any) {
                setDecryptError(e?.message || '검증 중 오류가 발생했습니다.');
            }
        },
        [decryptKey, isDecrypted, setDecryptionKey, toggleDecryption]
    );

    return {
        showDecryptModal,
        decryptKey,
        decryptError,
        isDecrypted,
        isAdmin,
        isModerator,
        handleDecryptSubmit,     // ✅ 카메라ID 받아 호출
        handleDecryptClick,
        setShowDecryptModal,
        setDecryptKey,
    };
};
