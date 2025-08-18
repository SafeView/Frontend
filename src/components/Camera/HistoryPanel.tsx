// ✅ 추가: 히스토리(필터 + 테이블) 컴포넌트 분리
import { useMemo, useState } from "react";
import styles from "../../pages/CameraPage.module.css"; // 경로 상황에 맞게 조정
import useKeyStore from "../../stores/keyStore"; // ✅ 키 검증 스토어 import


export interface HistoryRecord {
    timestamp: string; // "YYYY-MM-DD HH:mm"
    type: string;
    description: string;
    videoSrc?: string;
    filename?: string;
    userId?: string;
    isRaw?: boolean;

}

interface HistoryPanelProps {
    title?: string; // 기본 "Recording History"
    records: HistoryRecord[];
    onSelectHistory: (videoSrc?: string) => void;
    onDownload?: (filename?: string) => void;
}

const HistoryPanel = ({
                          title = "Recording History",
                          records,
                          onSelectHistory,
                          onDownload, // ✅ 추가
                      }: HistoryPanelProps) => {
    // ✅ 추가: 필터 로컬 상태(부모에서 가지고 있던 것 이전)
    const [filterKeyword, setFilterKeyword] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterStartTime, setFilterStartTime] = useState("");
    const [filterEndTime, setFilterEndTime] = useState("");

    const [pendingDownload, setPendingDownload] = useState<string | null>(null);
    const [showDecryptModal, setShowDecryptModal] = useState(false);
    const [decryptKey, setDecryptKey] = useState("");

    const {
        verifyKey,
        verifyResult,
        loading: keyLoading,
        error: keyError,
        clearError: clearKeyError,
    } = useKeyStore();

    // ✅ 추가: 필터링 로직
    const filtered = useMemo(() => {
        return records.filter((record) => {
            const [date, time] = record.timestamp.split(" ");
            const keywordMatch =
                !filterKeyword ||
                record.type.toLowerCase().includes(filterKeyword.toLowerCase()) ||
                record.description.toLowerCase().includes(filterKeyword.toLowerCase());

            const dateMatch =
                (!filterStartDate || date >= filterStartDate) &&
                (!filterEndDate || date <= filterEndDate);

            const timeMatch =
                (!filterStartTime || time >= filterStartTime) &&
                (!filterEndTime || time <= filterEndTime);

            return keywordMatch && dateMatch && timeMatch;
        });
    }, [records, filterKeyword, filterStartDate, filterEndDate, filterStartTime, filterEndTime]);

    const handleSubmitKey = async () => {
        if (!decryptKey || !pendingDownload) return;
        await verifyKey({ accessToken: decryptKey, cameraId: "CAMERA_001" });
    };

    // ✅ 키 검증 성공 시 자동 다운로드
    if (verifyResult && pendingDownload) {
        onDownload?.(pendingDownload);
        setPendingDownload(null);
        setShowDecryptModal(false);
    }

    return (
        <>
            <h3 className={styles.historyTitle}>{title}</h3>

            {/* ✅ 추가: 필터 UI */}
            <div className={styles.filterWrapper}>
                {/* 검색어 */}
                <input
                    type="text"
                    placeholder="검색어를 입력하세요 (Type 또는 Description)"
                    value={filterKeyword}
                    onChange={(e) => setFilterKeyword(e.target.value)}
                    className={styles.searchInput}
                />

                {/* 날짜 필터 */}
                <div className={styles.rowFilterGroup}>
                    <label className={styles.filterLabel}>📅 날짜:</label>
                    <input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className={styles.filterInput}
                    />
                    <span className={styles.tilde}>~</span>
                    <input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className={styles.filterInput}
                    />
                </div>

                {/* 시간 필터 */}
                <div className={styles.rowFilterGroup}>
                    <label className={styles.filterLabel}>⏰ 시간:</label>
                    <input
                        type="time"
                        value={filterStartTime}
                        onChange={(e) => setFilterStartTime(e.target.value)}
                        className={styles.filterInput}
                    />
                    <span className={styles.tilde}>~</span>
                    <input
                        type="time"
                        value={filterEndTime}
                        onChange={(e) => setFilterEndTime(e.target.value)}
                        className={styles.filterInput}
                    />
                </div>
            </div>

            {/* ✅ 변경: Download 열 추가 */}
            <table className={styles.historyTable}>
                <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Type</th>
                    <th>Description</th>
                    {records.some(r => r.userId) && <th>User</th>} {/* ✅ userId 존재 시 표시 */}
                    <th style={{ width: 110 }}>Action</th> {/* ✅ 추가 */}
                </tr>
                </thead>
                <tbody>
                {filtered.length > 0 ? (
                    filtered.map((record, idx) => (
                        <tr key={idx} className={styles.historyRow}>
                            <td onClick={() => onSelectHistory(record.videoSrc)}>{record.timestamp}</td>
                            <td onClick={() => onSelectHistory(record.videoSrc)}>
                                <span className={styles.badge}>{record.type}</span>
                            </td>
                            <td onClick={() => onSelectHistory(record.videoSrc)}>{record.description}</td>
                            {/* ✅ 관리자일 경우에만 userId 열 노출 */}
                            {records.some(r => r.userId) && (
                                <td onClick={() => onSelectHistory(record.videoSrc)}>
                                    <span className={styles.userId}>{record.userId}</span>
                                </td>
                            )}

                            <td>
                                {/* ✅ 추가: 파일이 있으면 다운로드 버튼 노출 */}
                                {onDownload && record.filename ? (
                                    <button
                                        className={styles.smallBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (record.isRaw) {
                                                setPendingDownload(record.filename || null);
                                                setShowDecryptModal(true); // ✅ 모달 먼저 띄움
                                            } else {
                                                onDownload?.(record.filename);
                                            }
                                        }}
                                    >
                                        Download
                                    </button>
                                ) : (
                                    <span className={styles.dim}>-</span>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className={styles.noRecord}>
                            No history available for this camera.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            {/* ✅ 키 입력 모달 */}
            {showDecryptModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h4>🔐 원본 영상 다운로드</h4>
                        <p>키를 입력해주세요:</p>
                        <input
                            type="text"
                            value={decryptKey}
                            onChange={(e) => setDecryptKey(e.target.value)}
                            className={styles.input}
                            placeholder="Access Token"
                        />
                        <div className={styles.modalActions}>
                            <button onClick={handleSubmitKey} disabled={keyLoading}>
                                {keyLoading ? "검증 중..." : "검증하기"}
                            </button>
                            <button onClick={() => {
                                setShowDecryptModal(false);
                                setPendingDownload(null);
                            }}>취소</button>
                        </div>

                        {keyError && (
                            <div className={styles.errorMsg}>
                                ⚠️ {keyError}
                                <button onClick={clearKeyError}>닫기</button>
                            </div>
                        )}
                        {verifyResult && (
                            <p className={styles.successMsg}>✅ 키 검증 성공! 다운로드 중...</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default HistoryPanel;
