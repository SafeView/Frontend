import { useEffect, useMemo, useState } from "react";
import styles from "./CameraPage.module.css";
import CameraFeed from "../components/Camera/CameraFeed.tsx";
//@ts-ignore
import CameraControls, { type Mode } from "../components/Camera/CameraControls";
import HistoryPanel, {type HistoryRecord } from "../components/Camera/HistoryPanel";
import useVideoStore from "../stores/videoStore";
import { useUIStore } from '../stores/uiStore';



/** -------------------------------
 * 더미 카메라 목록
 * 실제 구현 시 백엔드에서 받아올 예정
 * -------------------------------- */
const dummyCameras = [
    { id: 1, name: "Web Cam", location: "Office", videoSrc: "/videos/cam4.mp5" }, // 실제 웹캠 (.mp4 권장)
    { id: 2, name: "Entrance 1", location: "Main Gate", videoSrc: "/videos/cam1.mp4" },
    // { id: 3, name: "Parking Lot", location: "Lot A", videoSrc: "/videos/cam2.mp4" },
    // { id: 4, name: "Back Door", location: "Rear Exit", videoSrc: "/videos/cam3.mp4" },
    // { id: 5, name: "Front Desk", location: "Lobby", videoSrc: "/videos/cam4.mp4" },
];

const CameraPage = () => {
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

    // 현재 선택된 카메라
    const [selectedCamera, setSelectedCamera] = useState(dummyCameras[0]); // Web Cam이 첫 번째

    // 현재 재생 모드 (라이브 / 히스토리)
    const [mode, setMode] = useState<Mode>("live");

    // 현재 재생할 영상 소스 (라이브면 selectedCamera.videoSrc, 히스토리면 해당 기록 videoSrc)
    const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(dummyCameras[0].videoSrc);

    // ✅ zustand에서 필요한 상태/메서드 가져오기
    const {
        videos,
        //recording,
        lastRecordResult,
        //downloadUrl,
        //loading,
        //error,
        fetchVideos,
        //startRecording,
        //stopRecording,
        fetchDownloadUrl,
        //clearError,
        clearDownloadUrl,
    } = useVideoStore();

    // ✅ 파일명에서 "YYYYMMDD_HHMMSS" → "YYYY-MM-DD HH:mm" 파싱
    const tsFromFilename = (fn?: string) => {
        if (!fn) return "";
        const m = fn.match(/(\d{8})_(\d{6})/); // e.g., recording_20250810_162329.mp4
        if (!m) return "";
        const [_, ymd, hms] = m;
        const y = ymd.slice(0, 4);
        const mo = ymd.slice(4, 6);
        const d = ymd.slice(6, 8);
        const hh = hms.slice(0, 2);
        const mm = hms.slice(2, 4);
        return `${y}-${mo}-${d} ${hh}:${mm}`;
    };

    // ✅ 수정: fetchVideos 비동기 완료 후 로그 (직후에 찍으면 빈 배열 나옴)
    useEffect(() => {
        (async () => {
            try {
                await fetchVideos(); // ✅ 수정: 완료까지 대기
                console.log("[videos after fetch]", useVideoStore.getState().videos); // ✅ 수정: 완료 후 로그
            } catch (e) {
                console.error("[fetchVideos error]", e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCamera.id]); // ✅ fetchVideos는 외부 의존 제거(참조 안정 가정)

    // ✅ 수정: 녹화 저장 완료 시 목록 리프레시
    useEffect(() => {
        if (lastRecordResult) {
            fetchVideos().catch(() => {});
        }
    }, [lastRecordResult, fetchVideos]);

    // ✅ 수정: 백엔드에 cameraId가 없으므로 "카메라별 필터" 제거 → 전체 목록 사용
    //  (나중에 cameraId가 생기면 여기서 selectedCamera와 매칭하도록 복구)
    const historyRecords: HistoryRecord[] = useMemo(() => {
        return (videos || [])
            .map((v: any) => ({
                // ✅ 수정: 파일명 기반으로 표시용 timestamp 생성
                timestamp: tsFromFilename(v.filename) || "",
                type: "Recording", // ✅ 기본값
                description: v.filename || `id:${v.id}`,
                // ✅ 수정: 재생 가능한 URL은 s3Url 사용
                videoSrc: v.s3Url,
                // ✅ 다운로드 키는 filename 사용
                filename: v.filename,
            }))
            // ✅ 최신순 정렬
            .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
    }, [videos]);


    // ✅ 추가: 녹화 토글 (스토어 메서드 호출)
    // const handleToggleRecording = async () => {
    //     try {
    //         if (recording) {
    //             await stopRecording(); // 저장까지 포함
    //         } else {
    //             await startRecording();
    //         }
    //     } catch (e) {
    //         // 에러는 스토어에서 관리하므로 여기선 무시 가능
    //     }
    // };

    // 히스토리 클릭 시 해당 녹화 재생
    const handleSelectHistory = (videoSrc?: string) => {
        if (!videoSrc) return;
        setMode("history");
        setCurrentVideoSrc(videoSrc);
    };

    // 라이브 모드 복귀
    // const handleGoLive = () => {
    //     setMode("live");
    //     setCurrentVideoSrc(selectedCamera.videoSrc);
    // };

    // ✅ 다운로드: presigned URL 받아서 새 탭 오픈
    const handleDownload = async (filename?: string) => {
        if (!filename) return;
        await fetchDownloadUrl(filename);
        const url = useVideoStore.getState().downloadUrl;
        if (url) {
            window.open(url, "_blank");
            clearDownloadUrl();
        }
    };

    // 선택 카메라 변경 시 라이브로 전환
    const handleSelectCamera = (cam: (typeof dummyCameras)[number]) => {
        setSelectedCamera(cam);
        setMode("live");
        setCurrentVideoSrc(cam.videoSrc);
    };


    return (
        <div className={styles.container}
             style={{
                 marginLeft: isSidebarOpen ? "0px" : "50px",  // ✅ 사이드바 상태에 따라 여백 조정
             }}>
            {/* 왼쪽 카메라 선택 목록 */}
            <aside className={styles.sidebar}>
                <h2 className={styles.title}>Cameras</h2>
                <ul className={styles.cameraList}>
                    {dummyCameras.map((cam) => (
                        <li
                            key={cam.id}
                            className={`${styles.cameraItem} ${cam.id === selectedCamera.id ? styles.active : ""}`}
                            onClick={() => handleSelectCamera(cam)} // ✅ 동일
                        >
                            <span className={styles.cameraName}>{cam.name}</span>
                            <span className={styles.location}>{cam.location}</span>
                        </li>
                    ))}
                </ul>
                {/*/!* ✅ 추가: 로딩/에러 간단 표기 (원하면 Toast로 대체) *!/*/}
                {/*{loading && <div className={styles.info}>로딩 중...</div>}*/}
                {/*{error && (*/}
                {/*    <div className={styles.error} onClick={clearError}>*/}
                {/*        {error} (클릭하여 닫기)*/}
                {/*    </div>*/}
                {/*)}*/}
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
                            className={styles.videoPlayer}
                            controls
                            autoPlay
                            muted
                        />
                    )}
                </div>

                {/* ✅ 변경: 스토어 연동된 컨트롤 */}
                {/*<CameraControls*/}
                {/*    isRecording={recording}                // ✅ 수정: 로컬 → 스토어*/}
                {/*    onToggleRecording={handleToggleRecording}*/}
                {/*    mode={mode}*/}
                {/*    onGoLive={handleGoLive}*/}
                {/*/>*/}

                {/* ✅ 변경: 스토어에서 가져온 히스토리 전달 + 다운로드 핸들러 */}
                <HistoryPanel
                    title="Recording History"
                    records={historyRecords}
                    onSelectHistory={handleSelectHistory}
                    onDownload={handleDownload}            // ✅ 추가
                />
            </main>
        </div>
    );
};

export default CameraPage;
