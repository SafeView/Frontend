// src/components/Setting/KeyVerificationModal.tsx

import React, { useState } from 'react';
import styles from './KeyVerificationModal.module.css';
import useKeyStore from "../../stores/keyStore.ts";

interface Props {
    onClose: () => void;
}


const KeyVerificationModal: React.FC<Props> = ({ onClose }) => {
    // ✅ 상태 관리 직접 호출
    const {
        keyInfo,
        verifyKey,
        verifyResult,
        error: keyError,
        clearError: clearKeyError,
    } = useKeyStore();

    // ✅ 입력된 키 상태
    const [inputKey, setInputKey] = useState('');

    // ✅ 닫기 시 전체 초기화
    const handleClose = () => {
        clearKeyError(); // 에러 초기화
        useKeyStore.setState({ verifyResult: null }); // 검증 성공 상태 초기화
        setInputKey(''); // 입력창 초기화
        onClose(); // 모달 닫기
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>🔐 키 검증</h2>

                {/* ✅ 키 입력창 */}
                <input
                    type="text"
                    className={styles.input}
                    placeholder="복호화 키를 입력하세요"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                />

                {/* 키 검증 버튼 */}
                <button
                    onClick={() => {
                        if (!inputKey || inputKey.length < 10) {
                            alert('키를 정확히 입력하세요.');
                            return;
                        }
                        verifyKey({ accessToken: inputKey, cameraId: 'CAMERA_001' }); // 예시 cameraId
                    }}
                >
                    키 검증
                </button>

                {/* ✅ 성공 메시지 */}
                {verifyResult && !keyError && (
                    <p className={styles.success}>✅ 유효한 키입니다.</p>
                )}

                {/* ❌ 에러 메시지 */}
                {keyError && (
                    <div className={styles.error}>
                        ⚠️ 유효하지 않은 키입니다.
                    </div>
                )}

                {/*/!* 발급된 키 정보 (참고용) *!/*/}
                {/*{keyInfo && (*/}
                {/*    <div className={styles.referenceBox}>*/}
                {/*        <p>📌 최근 발급 키 (참고):</p>*/}
                {/*        <p className={styles.keyText}>{keyInfo.accessToken}</p>*/}
                {/*    </div>*/}
                {/*)}*/}

                {/* 📋 키 이력 섹션 (임시) */}
                {/*<div className={styles.historyBox}>*/}
                {/*    <p>🕓 최근 키 이력 기능은 추후 구현 예정</p>*/}
                {/*</div>*/}

                <button className={styles.closeButton} onClick={handleClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default KeyVerificationModal;
