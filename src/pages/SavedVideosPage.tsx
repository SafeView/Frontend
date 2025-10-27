// src/pages/SavedVideosPage.tsx
import React from 'react';
import styles from './SavedVideosPage.module.css';
import HistoryPanel from '../components/Camera/HistoryPanel';
import useVideoStore from '../stores/videoStore';
import useUserStore from '../stores/userStore';
import { useUIStore } from '../stores/uiStore'; // UI 상태 전역 저장소


const SavedVideosPage = () => {
    const { user } = useUserStore();
    const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
    const { videos, adminVideos, fetchVideos, fetchAdminVideos, fetchDownloadUrl, fetchStreamUrl, clearDownloadUrl } = useVideoStore();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [streamSrc, setStreamSrc] = React.useState<string | null>(null);

    // ✅ 영상 데이터 불러오기
    React.useEffect(() => {
        const loadVideos = async () => {
            if (!user) return;

            if (user.role === 'ADMIN') {
                await fetchAdminVideos(); // 전체 불러옴
            } else if (user.role === 'MODERATOR') {
                // ✅ MODERATOR도 adminVideos를 불러오지만, 본인 것만 필터링
                await fetchAdminVideos();
            } else {
                await fetchVideos(); // 일반 사용자
            }
        };

        loadVideos();
    }, [user]);

    // ✅ 파일명에서 타임스탬프 추출
    const tsFromFilename = (fn?: string) => {
        if (!fn) return "";
        const m = fn.match(/(\d{8})_(\d{6})/);
        if (!m) return "";
        const [_, ymd, hms] = m;
        return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)} ${hms.slice(0, 2)}:${hms.slice(2, 4)}`;
    };

    // ✅ 다운로드 처리
    const handleDownload = async (filename?: string) => {
        if (!filename) return;
        await fetchDownloadUrl(filename);
        const url = useVideoStore.getState().downloadUrl;
        if (url) {
            window.open(url, '_blank');
            clearDownloadUrl();
        }
    };


    // 영상 스트리밍 전용 핸들러
    const handleStreamVideo = async (filename?: string) => {
        if (!filename) return;

        // zustand 스토어에서 fetchStreamUrl 호출
        await fetchStreamUrl(filename);

        const url = useVideoStore.getState().streamUrl;
        if (url) {
            setStreamSrc(url);         // ✅ 영상 URL 저장
            setIsModalOpen(true);      // ✅ 모달 오픈
            setTimeout(() => {
                // streamUrl 초기화 (선택사항)
                useVideoStore.getState().clearStreamUrl?.();
            }, 1000);
        }
    };

    // ✅ record 목록 구성 (역할별)
    const records = React.useMemo(() => {
        if (!user) return [];

        if (user.role === 'ADMIN') {
            // 🔸 관리자: 전체 adminVideos 표시
            return adminVideos.flatMap((video) =>
                video.filenames.map((filename, idx) => ({
                    timestamp: tsFromFilename(filename),
                    type: filename.includes('_raw') ? '원본' : '모자이크',
                    description: filename,
                    videoSrc: video.s3Urls[idx],
                    filename,
                    userId: video.userId,
                    isRaw: filename.includes('_raw'),
                }))
            );
        }

        if (user.role === 'MODERATOR') {
            // 🔸 모더레이터: 자신의 userId에 해당하는 영상만 표시
            const myVideos = adminVideos.filter(v => v.userId === user.id); // ✅ 수정됨

            return myVideos.flatMap((video) =>
                video.filenames.map((filename, idx) => ({
                    timestamp: tsFromFilename(filename),
                    type: filename.includes('_raw') ? '원본' : '모자이크',
                    description: filename,
                    videoSrc: video.s3Urls[idx],
                    filename,
                    userId: video.userId,
                    isRaw: filename.includes('_raw'),
                }))
            );
        }

        // 🔸 일반 사용자
        return videos
            .filter(v => !v.filename.includes('_raw'))
            .map(v => ({
                timestamp: tsFromFilename(v.filename),
                type: '모자이크',
                description: v.filename,
                videoSrc: v.s3Url,
                filename: v.filename,
            }));
    }, [user, videos, adminVideos]);

    return (
        <div
            className={styles.container}
            style={{ marginLeft: isSidebarOpen ? "0px" : "50px" }} // 사이드바 닫힘 시 여백 확보
        >
            <h2 className={styles.title}>저장된 영상</h2>
            <HistoryPanel
                title="저장 기록"
                records={records}
                onStream={handleStreamVideo}
                onDownload={handleDownload}
            />

            {isModalOpen && streamSrc && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <video src={streamSrc} controls autoPlay style={{ width: '100%' }} />
                        <button onClick={() => { setIsModalOpen(false); setStreamSrc(null); }}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedVideosPage;
