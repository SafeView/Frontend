import { useState } from "react";
import styles from "./CameraPage.module.css";
import { FaStop, FaPlay, FaCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import CameraFeed from "../components/Camera/CameraFeed.tsx";

/** -------------------------------
 * 더미 카메라 목록
 * 실제 구현 시 백엔드에서 받아올 예정
 * -------------------------------- */
const dummyCameras = [
    { id: 1, name: "Web Cam", location: "Office", videoSrc: "/videos/cam4.mp5" }, // 실제 웹캠
    { id: 2, name: "Entrance 1", location: "Main Gate", videoSrc: "/videos/cam1.mp4" },
    { id: 3, name: "Parking Lot", location: "Lot A", videoSrc: "/videos/cam2.mp4" },
    { id: 4, name: "Back Door", location: "Rear Exit", videoSrc: "/videos/cam3.mp4" },
    { id: 5, name: "Front Desk", location: "Lobby", videoSrc: "/videos/cam4.mp4" },
];

/** -------------------------------
 * 카메라별 녹화 히스토리 (최신순)
 * videoSrc: 녹화 파일 경로 (없으면 null)
 * -------------------------------- */
const dummyHistory: Record<
    number,
    { timestamp: string; type: string; description: string; videoSrc?: string }[]
> = {
    1: [
        {
            timestamp: "2025-07-17 14:30",
            type: "AI Detection",
            description: "Person detected with AI",
            videoSrc: "/recordings/webcam_ai_20250717.mp4",
        },
        {
            timestamp: "2025-07-16 09:15",
            type: "Motion",
            description: "Motion detected",
            videoSrc: "/recordings/webcam_motion_20250716.mp4",
        },
    ],
    2: [
        {
            timestamp: "2025-07-17 14:30",
            type: "Intrusion",
            description: "Person detected",
            videoSrc: "/recordings/cam1_intrusion_20250717.mp4",
        },
        {
            timestamp: "2025-07-16 09:15",
            type: "Motion",
            description: "Motion near gate",
            videoSrc: "/recordings/cam1_motion_20250716.mp4",
        },
    ],
    3: [
        {
            timestamp: "2025-07-17 09:00",
            type: "Suspicious Activity",
            description: "Car loitering",
            videoSrc: "/recordings/cam2_susp_20250717.mp4",
        },
    ],
    4: [],
    5: [
        {
            timestamp: "2025-07-15 11:00",
            type: "Crowd",
            description: "Multiple people detected",
            videoSrc: "/recordings/cam4_crowd_20250715.mp4",
        },
    ],
};

type Mode = "live" | "history";

const CameraPage = () => {
    // 현재 선택된 카메라
    const [selectedCamera, setSelectedCamera] = useState(dummyCameras[0]); // Web Cam이 첫 번째

    // 현재 재생 모드 (라이브 / 히스토리)
    const [mode, setMode] = useState<Mode>("live");

    // 현재 재생할 영상 소스 (라이브면 selectedCamera.videoSrc, 히스토리면 해당 기록 videoSrc)
    const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(
        dummyCameras[0].videoSrc // Web Cam이 첫 번째
    );

    // 녹화 토글 상태
    const [isRecording, setIsRecording] = useState(false);

    // 모자이크 토글 상태
    const [isMosaic, setIsMosaic] = useState(false);

    // 필터링 상태
    const [filterKeyword, setFilterKeyword] = useState("");

    // 날짜/시간 필터링 상태
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterStartTime, setFilterStartTime] = useState("");
    const [filterEndTime, setFilterEndTime] = useState("");

    // 선택 카메라 변경 시 라이브로 전환
    const handleSelectCamera = (cam: (typeof dummyCameras)[number]) => {
        setSelectedCamera(cam);
        setMode("live");
        setCurrentVideoSrc(cam.videoSrc);
    };

    // 히스토리 클릭 시 해당 녹화 재생
    const handleSelectHistory = (videoSrc?: string) => {
        if (!videoSrc) return;
        setMode("history");
        setCurrentVideoSrc(videoSrc);
    };

    // 라이브 모드 복귀
    const handleGoLive = () => {
        setMode("live");
        setCurrentVideoSrc(selectedCamera.videoSrc);
    };

    // 녹화 토글 (실제 구현 시 API 연동)
    const handleToggleRecording = () => {
        const next = !isRecording;
        setIsRecording(next);
        console.log(
            next ? "녹화 시작 API 호출" : "녹화 중지 API 호출",
            "cameraId=",
            selectedCamera.id
        );
    };

    // 모자이크 토글
    const handleToggleMosaic = () => {
        const next = !isMosaic;
        setIsMosaic(next);
        console.log("모자이크 토글:", next);
    };

    const history = dummyHistory[selectedCamera.id] || [];


    // 필터링된 히스토리
    const filteredHistory = history.filter((record) => {
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


    return (
        <div className={styles.container}>
            {/* 왼쪽 카메라 선택 목록 */}
            <aside className={styles.sidebar}>
                <h2 className={styles.title}>Cameras</h2>
                <ul className={styles.cameraList}>
                    {dummyCameras.map((cam) => (
                        <li
                            key={cam.id}
                            className={`${styles.cameraItem} ${
                                cam.id === selectedCamera.id ? styles.active : ""
                            }`}
                            onClick={() => handleSelectCamera(cam)}
                        >
                            <span className={styles.cameraName}>{cam.name}</span>
                            <span className={styles.location}>{cam.location}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* 우측 영상 + 컨트롤 + 히스토리 */}
            <main className={styles.videoPanel}>
                <h2 className={styles.videoTitle}>
                    {selectedCamera.name} - {mode === "live" ? "Live View" : "Recorded"}
                </h2>

                <div className={styles.videoWrapper}>
                    {selectedCamera.name === "Web Cam" ? (
                        <CameraFeed enableAI={true} decrypted={false} />
                    ) : (
                        <video
                            key={currentVideoSrc}
                            src={currentVideoSrc}
                            className={`${styles.videoPlayer} ${isMosaic ? styles.mosaic : ""}`}
                            controls
                            autoPlay
                            muted
                        />
                    )}
                </div>

                {/* 영상 컨트롤 버튼들 */}
                <div className={styles.controls}>
                    {/* 🎥 녹화 버튼 */}
                    <button
                        className={`${styles.ctrlBtn} ${isRecording ? styles.activeBtn : ""}`}
                        onClick={handleToggleRecording}
                    >
                        {isRecording ? (
                            <>
                                <FaStop className={styles.icon} />
                                녹화 중지
                            </>
                        ) : (
                            <>
                                <FaCircle className={styles.icon} />
                                녹화 시작
                            </>
                        )}
                    </button>

                    {/* 🔴 라이브 복귀 버튼 */}
                    <button
                        className={`${styles.ctrlBtn} ${mode === "live" ? styles.disabledBtn : ""}`}
                        onClick={handleGoLive}
                        disabled={mode === "live"}
                    >
                        <FaPlay className={styles.icon} />
                        LIVE
                    </button>

                    {/* 🟣 모자이크 토글 */}
                    <button
                        className={`${styles.ctrlBtn} ${isMosaic ? styles.activeBtn : ""}`}
                        onClick={handleToggleMosaic}
                    >
                        {isMosaic ? (
                            <>
                                <FaEyeSlash className={styles.icon} />
                                모자이크 OFF
                            </>
                        ) : (
                            <>
                                <FaEye className={styles.icon} />
                                모자이크 ON
                            </>
                        )}
                    </button>
                </div>

                <h3 className={styles.historyTitle}>Recording History</h3>


                {/* 필터 UI 추가 */}
                <div className={styles.filterContainer}>
                    <input
                        type="text"
                        placeholder="검색어 (Type/Description)"
                        value={filterKeyword}
                        onChange={(e) => setFilterKeyword(e.target.value)}
                        className={styles.filterInput}
                    />
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

                {/* 히스토리 테이블 */}
                <table className={styles.historyTable}>
                    <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((record, idx) => (
                            <tr
                                key={idx}
                                className={styles.historyRow}
                                onClick={() => handleSelectHistory(record.videoSrc)}
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
            </main>
        </div>
    );
};

export default CameraPage;
