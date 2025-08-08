// ✅ 추가: 히스토리(필터 + 테이블) 컴포넌트 분리
import { useMemo, useState } from "react";
import styles from "../../pages/CameraPage.module.css"; // 경로 상황에 맞게 조정

export interface HistoryRecord {
    timestamp: string; // "YYYY-MM-DD HH:mm"
    type: string;
    description: string;
    videoSrc?: string;
}

interface HistoryPanelProps {
    title?: string; // 기본 "Recording History"
    records: HistoryRecord[];
    onSelectHistory: (videoSrc?: string) => void;
}

const HistoryPanel = ({
                          title = "Recording History",
                          records,
                          onSelectHistory,
                      }: HistoryPanelProps) => {
    // ✅ 추가: 필터 로컬 상태(부모에서 가지고 있던 것 이전)
    const [filterKeyword, setFilterKeyword] = useState("");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterStartTime, setFilterStartTime] = useState("");
    const [filterEndTime, setFilterEndTime] = useState("");

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

            {/* ✅ 추가: 히스토리 테이블 */}
            <table className={styles.historyTable}>
                <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                {filtered.length > 0 ? (
                    filtered.map((record, idx) => (
                        <tr
                            key={idx}
                            className={styles.historyRow}
                            onClick={() => onSelectHistory(record.videoSrc)}
                        >
                            <td>{record.timestamp}</td>
                            <td>
                                <span className={styles.badge}>{record.type}</span>
                            </td>
                            <td>{record.description}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} className={styles.noRecord}>
                            No history available for this camera.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
};

export default HistoryPanel;
