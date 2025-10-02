// src/pages/CameraPage.tsx

import { useEffect, useMemo, useState } from "react";
import styles from "./CameraPage.module.css";
import CameraFeed from "../components/Camera/CameraFeed.tsx";
import { type Mode } from "../components/Camera/CameraControls"; // 녹화 컨트롤 (현재 미사용)
import HistoryPanel, { type HistoryRecord } from "../components/Camera/HistoryPanel"; // 영상 히스토리 리스트
import useVideoStore from "../stores/videoStore"; // 영상 관련 zustand 스토어
import { useUIStore } from '../stores/uiStore'; // UI 관련 스토어 (예: 사이드바 열림 여부)
import useUserStore from "../stores/userStore.ts"; // 유저 정보 스토어

/** -------------------------------
 * 📹 더미 카메라 목록 (향후 백엔드에서 받아올 예정)
 * -------------------------------- */
const dummyCameras = [
    { id: 1, name: "웹 캠", location: "사무실", videoSrc: "/videos/cam4.mp5" },
    //{ id: 2, name: "Entrance 1", location: "Main Gate", videoSrc: "/videos/cam1.mp4" },
    // 비활성 카메라: 개발 시 확장 가능
];

/**
 * 📺 CameraPage 컴포넌트
 * - 카메라 실시간 뷰 + 히스토리 영상 조회 + 관리자/일반 유저 분기
 */
const CameraPage = () => {
    // 현재 유저 정보
    const { user } = useUserStore();

    // 관리자 또는 중간관리자인지 여부
    const isPrivileged = user?.role === "ADMIN" || user?.role === "MODERATOR";

    // 사이드바 열림 여부
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

    // 현재 선택된 카메라 (기본: Web Cam)
    const [selectedCamera, setSelectedCamera] = useState(dummyCameras[0]);

    // 현재 모드 (live | history)
    const [mode, setMode] = useState<Mode>("live");

    // 현재 재생 중인 영상 경로
    const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(dummyCameras[0].videoSrc);

    // 🎥 zustand 스토어에서 필요한 상태/함수 추출
    const {
        videos,             // 일반 유저용 영상 목록
        lastRecordResult,  // 녹화 완료 후 결과
        fetchVideos,       // 영상 목록 불러오기
        fetchDownloadUrl,  // 다운로드 presigned URL 요청
        clearDownloadUrl,  // 다운로드 URL 초기화
        adminVideos,       // 관리자용 영상 목록
        fetchAdminVideos,  // 관리자 영상 목록 불러오기
    } = useVideoStore();

    // 🔍 파일 이름 → 시간 정보 파싱 (예: 20250810_162329 → 2025-08-10 16:23)
    const tsFromFilename = (fn?: string) => {
        if (!fn) return "";
        const m = fn.match(/(\d{8})_(\d{6})/);
        if (!m) return "";
        const [_, ymd, hms] = m;
        return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)} ${hms.slice(0, 2)}:${hms.slice(2, 4)}`;
    };

    /** ✅ 관리자일 경우 전체 유저 영상 목록 불러오기 */
    useEffect(() => {
        if (!user?.id || !isPrivileged) return;
        fetchAdminVideos().catch((e) => console.error("[fetchAdminVideos error]", e));
    }, [user, fetchAdminVideos]);

    /** ✅ 선택된 카메라가 변경될 때 영상 목록 갱신 */
    useEffect(() => {
        (async () => {
            try {
                await fetchVideos(); // 영상 목록 받아오기
                console.log("[videos after fetch]", useVideoStore.getState().videos);
            } catch (e) {
                console.error("[fetchVideos error]", e);
            }
        })();
    }, [selectedCamera.id]);

    /** ✅ 녹화 저장 결과 발생 시 영상 목록 새로고침 */
    useEffect(() => {
        if (lastRecordResult) {
            fetchVideos().catch(() => {});
        }
    }, [lastRecordResult, fetchVideos]);

    /** ✅ 히스토리 패널에 넘길 기록 목록 구성 */
    const historyRecords: HistoryRecord[] = useMemo(() => {
        if (!user) return [];

        // 일반 유저: 모자이크 영상만
        if (user.role === "USER") {
            return videos
                .filter((v) => !v.filename.includes('_raw'))
                .map((v) => ({
                    timestamp: tsFromFilename(v.filename),
                    type: "모자이크",
                    description: v.filename,
                    videoSrc: v.s3Url,
                    filename: v.filename,
                }))
                .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
        }

        // 관리자/중간관리자: 유저 아이디, 원본/모자이크 구분 포함
        return adminVideos.flatMap((video) => {
            return video.filenames.map((filename, idx) => {
                const s3Url = video.s3Urls[idx];
                const isRaw = filename.includes("_raw");
                return {
                    timestamp: tsFromFilename(filename),
                    type: isRaw ? "원본" : "모자이크",
                    description: filename,
                    videoSrc: s3Url,
                    filename,
                    userId: video.userId,
                    isRaw,
                };
            });
        }).sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
    }, [user, videos, adminVideos]);

    /** 🔁 히스토리 항목 선택 → 녹화 영상 재생 */
    const handleSelectHistory = (videoSrc?: string) => {
        if (!videoSrc) return;
        setMode("history");
        setCurrentVideoSrc(videoSrc);
    };

    /** 📥 영상 다운로드 요청 → presigned URL 새 탭 오픈 */
    const handleDownload = async (filename?: string) => {
        if (!filename) return;
        await fetchDownloadUrl(filename);
        const url = useVideoStore.getState().downloadUrl;
        if (url) {
            window.open(url, "_blank");
            clearDownloadUrl();
        }
    };

    /** 📷 카메라 변경 시 라이브 모드로 복귀 */
    const handleSelectCamera = (cam: (typeof dummyCameras)[number]) => {
        setSelectedCamera(cam);
        setMode("live");
        setCurrentVideoSrc(cam.videoSrc);
    };

    /** ✅ 렌더링 시작 */
    return (
        <div className={styles.container}
             style={{
                 marginLeft: isSidebarOpen ? "0px" : "50px",  // 사이드바 상태에 따른 여백 조정
             }}>
            {/* 왼쪽 카메라 목록 */}
            <aside className={styles.sidebar}>
                <h2 className={styles.title}>카메라</h2>
                <ul className={styles.cameraList}>
                    {dummyCameras.map((cam) => (
                        <li
                            key={cam.id}
                            className={`${styles.cameraItem} ${cam.id === selectedCamera.id ? styles.active : ""}`}
                            onClick={() => handleSelectCamera(cam)}
                        >
                            <span className={styles.cameraName}>{cam.name}</span>
                            <span className={styles.location}>{cam.location}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* 오른쪽: 영상 영역 + 기록 */}
            <main className={styles.videoPanel}>
                <h2 className={styles.videoTitle}>
                    {selectedCamera.name} - {mode === "live" ? "실시간 보기" : "녹화 영상"}
                </h2>

                {/* 📹 실시간 웹 캠 or 녹화영상 */}
                <div className={styles.videoWrapper}>
                    {selectedCamera.name === "웹 캠" ? (
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

                {/* 🎛️ 컨트롤 바 (현재 미사용) */}
                {/* <CameraControls
                    isRecording={recording}
                    onToggleRecording={handleToggleRecording}
                    mode={mode}
                    onGoLive={handleGoLive}
                /> */}

                {/* 🕒 영상 히스토리 패널 */}
                <HistoryPanel
                    title="Recording History"
                    records={historyRecords}
                    onSelectHistory={handleSelectHistory}
                    onDownload={handleDownload}
                />
            </main>
        </div>
    );
};

export default CameraPage;
