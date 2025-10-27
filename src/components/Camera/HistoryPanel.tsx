// ✅ 스타일 모듈 import (페이지 단위 CSS 사용 중)
import styles from "./HistoryPanel.module.css";

// 🔹 히스토리 레코드 데이터 타입 정의
export interface HistoryRecord {
    timestamp: string; // "YYYY-MM-DD HH:mm"
    type: string;
    description: string;
    videoSrc?: string;    // 영상 URL (재생용)
    filename?: string;    // 다운로드 파일명
    userId?: string;      // 관리자용 정보
    isRaw?: boolean;      // 복호화가 필요한 원본 여부
}

// 🔹 컴포넌트 Props 타입 정의
interface HistoryPanelProps {
    title?: string; // 섹션 타이틀 (기본값: "Recording History")
    records: HistoryRecord[]; // 기록 데이터 배열
    onStream: (filename?: string) => void; // 테이블 클릭 시 영상 선택 처리
    onDownload?: (filename?: string) => void;     // 다운로드 함수 (옵션)
}

// 🔹 히스토리 패널 컴포넌트 정의
const HistoryPanel = ({
                          title = "Recording History",
                          records,
                          onStream,
                          onDownload,
                      }: HistoryPanelProps) => {



    // ✅ 필터 관련 로컬 상태
    // const [filterKeyword, setFilterKeyword] = useState("");
    // const [filterStartDate, setFilterStartDate] = useState("");
    // const [filterEndDate, setFilterEndDate] = useState("");
    // const [filterStartTime, setFilterStartTime] = useState("");
    // const [filterEndTime, setFilterEndTime] = useState("");

    // ✅ 복호화 키 입력 및 모달 상태
    // const [pendingDownload, setPendingDownload] = useState<string | null>(null); // 검증 후 다운로드할 파일
    // const [showDecryptModal, setShowDecryptModal] = useState(false);             // 모달 표시 여부
    // const [decryptKey, setDecryptKey] = useState("");                            // 입력 중인 키
    //
    // // ✅ 키 검증 스토어 훅 (Zustand)
    // const {
    //     verifyKey,         // 키 검증 함수
    //     verifyResult,      // 성공 여부
    //     loading: keyLoading,
    //     error: keyError,
    //     clearError: clearKeyError,
    // } = useKeyStore();
    //
    // // ✅ 필터링 로직 (useMemo로 성능 최적화)
    // const filtered = useMemo(() => {
    //     return records.filter((record) => {
    //         const [date, time] = record.timestamp.split(" ");
    //
    //         // 검색어 필터: type, description 포함 여부
    //         const keywordMatch =
    //             !filterKeyword ||
    //             record.type.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    //             record.description.toLowerCase().includes(filterKeyword.toLowerCase());
    //
    //         // 날짜 필터
    //         const dateMatch =
    //             (!filterStartDate || date >= filterStartDate) &&
    //             (!filterEndDate || date <= filterEndDate);
    //
    //         // 시간 필터
    //         const timeMatch =
    //             (!filterStartTime || time >= filterStartTime) &&
    //             (!filterEndTime || time <= filterEndTime);
    //
    //         return keywordMatch && dateMatch && timeMatch;
    //     });
    // }, [records, filterKeyword, filterStartDate, filterEndDate, filterStartTime, filterEndTime]);

    // ✅ 키 입력 제출 핸들러
    // const handleSubmitKey = async () => {
    //     if (!decryptKey || !pendingDownload) return;
    //     await verifyKey({ accessToken: decryptKey, cameraId: "CAMERA_001" });
    // };
    //
    // // ✅ 검증 성공 → 자동 다운로드
    // if (verifyResult && pendingDownload) {
    //     onDownload?.(pendingDownload);
    //     setPendingDownload(null);
    //     setShowDecryptModal(false);
    // }

    return (
        <>
            {/* 🔹 섹션 타이틀 */}
            <h3 className={styles.historyTitle}>{title}</h3>

            {/* 🔹 필터 영역 */}
            {/*<div className={styles.filterWrapper}>*/}
            {/*    /!* 검색어 필터 *!/*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        placeholder="검색어를 입력하세요 (Type 또는 Description)"*/}
            {/*        value={filterKeyword}*/}
            {/*        onChange={(e) => setFilterKeyword(e.target.value)}*/}
            {/*        className={styles.searchInput}*/}
            {/*    />*/}

            {/*    /!* 날짜 필터 *!/*/}
            {/*    <div className={styles.rowFilterGroup}>*/}
            {/*        <label className={styles.filterLabel}>📅 날짜:</label>*/}
            {/*        <input*/}
            {/*            type="date"*/}
            {/*            value={filterStartDate}*/}
            {/*            onChange={(e) => setFilterStartDate(e.target.value)}*/}
            {/*            className={styles.filterInput}*/}
            {/*        />*/}
            {/*        <span className={styles.tilde}>~</span>*/}
            {/*        <input*/}
            {/*            type="date"*/}
            {/*            value={filterEndDate}*/}
            {/*            onChange={(e) => setFilterEndDate(e.target.value)}*/}
            {/*            className={styles.filterInput}*/}
            {/*        />*/}
            {/*    </div>*/}

            {/*    /!* 시간 필터 *!/*/}
            {/*    <div className={styles.rowFilterGroup}>*/}
            {/*        <label className={styles.filterLabel}>⏰ 시간:</label>*/}
            {/*        <input*/}
            {/*            type="time"*/}
            {/*            value={filterStartTime}*/}
            {/*            onChange={(e) => setFilterStartTime(e.target.value)}*/}
            {/*            className={styles.filterInput}*/}
            {/*        />*/}
            {/*        <span className={styles.tilde}>~</span>*/}
            {/*        <input*/}
            {/*            type="time"*/}
            {/*            value={filterEndTime}*/}
            {/*            onChange={(e) => setFilterEndTime(e.target.value)}*/}
            {/*            className={styles.filterInput}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* 🔹 테이블 출력 */}
            <table className={styles.historyTable}>
                <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Type</th>
                    <th>Description</th>
                    {records.some(r => r.userId) && <th>User</th>} {/* 관리자 화면인 경우만 노출 */}
                    <th style={{ width: 110 }}>Action</th>
                </tr>
                </thead>
                <tbody>
                {records.length > 0 ? (
                    records.map((record, idx) => (
                        <tr key={idx} className={styles.historyRow}>
                            {/* 테이블 클릭 시 영상 선택 */}
                            <td onClick={() => onStream(record.filename)}>{record.timestamp}</td>
                            <td onClick={() => onStream(record.filename)}>
                                <span className={styles.badge}>{record.type}</span>
                            </td>
                            <td onClick={() => onStream(record.filename)}>{record.description}</td>

                            {records.some(r => r.userId) && (
                                <td onClick={() => onStream(record.filename)}>
                                    <span className={styles.userId}>{record.userId}</span>
                                </td>
                            )}

                            {/* 🔹 다운로드, 재생 버튼 */}
                            <td className={styles.actionCell}>
                                <button
                                    className={styles.smallBtn}
                                    onClick={(e) => {
                                        e.stopPropagation(); // 테이블 row 클릭 방지
                                        onStream(record.filename);
                                    }}
                                >
                                    Play
                                </button>

                                {onDownload && record.filename ? (
                                    <button
                                        className={styles.smallBtn}
                                        onClick={(e) => {
                                            e.stopPropagation(); // 테이블 row 클릭 방지
                                            onDownload?.(record.filename);
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
                            저장된 영상이 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* 🔹 복호화 키 입력 모달 */}
            {/*{showDecryptModal && (*/}
            {/*    <div className={styles.modalBackdrop}>*/}
            {/*        <div className={styles.modalContent}>*/}
            {/*            <h4>🔐 원본 영상 다운로드</h4>*/}
            {/*            <p>키를 입력해주세요:</p>*/}
            {/*            <input*/}
            {/*                type="text"*/}
            {/*                value={decryptKey}*/}
            {/*                onChange={(e) => setDecryptKey(e.target.value)}*/}
            {/*                className={styles.input}*/}
            {/*                placeholder="Access Token"*/}
            {/*            />*/}
            {/*            <div className={styles.modalActions}>*/}
            {/*                <button onClick={handleSubmitKey} disabled={keyLoading}>*/}
            {/*                    {keyLoading ? "검증 중..." : "검증하기"}*/}
            {/*                </button>*/}
            {/*                <button onClick={() => {*/}
            {/*                    setShowDecryptModal(false);*/}
            {/*                    setPendingDownload(null);*/}
            {/*                }}>취소</button>*/}
            {/*            </div>*/}

            {/*            /!* 에러 메시지 *!/*/}
            {/*            {keyError && (*/}
            {/*                <div className={styles.errorMsg}>*/}
            {/*                    ⚠️ 유효하지 않은 키*/}
            {/*                    /!*{keyError}*!/*/}
            {/*                    <button onClick={clearKeyError}>닫기</button>*/}
            {/*                </div>*/}
            {/*            )}*/}

            {/*            /!* 성공 메시지 *!/*/}
            {/*            {verifyResult && (*/}
            {/*                <p className={styles.successMsg}>✅ 키 검증 성공! 다운로드 중...</p>*/}
            {/*            )}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </>
    );
};

export default HistoryPanel;
