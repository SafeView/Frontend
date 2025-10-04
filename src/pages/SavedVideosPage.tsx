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
    const { videos, adminVideos, fetchVideos, fetchAdminVideos, fetchDownloadUrl, clearDownloadUrl } = useVideoStore();

    React.useEffect(() => {
        if (user?.role === 'ADMIN' || user?.role === 'MODERATOR') {
            fetchAdminVideos();
        } else {
            fetchVideos();
        }
    }, [user]);

    const tsFromFilename = (fn?: string) => {
        if (!fn) return "";
        const m = fn.match(/(\d{8})_(\d{6})/);
        if (!m) return "";
        const [_, ymd, hms] = m;
        return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)} ${hms.slice(0, 2)}:${hms.slice(2, 4)}`;
    };

    const handleDownload = async (filename?: string) => {
        if (!filename) return;
        await fetchDownloadUrl(filename);
        const url = useVideoStore.getState().downloadUrl;
        if (url) {
            window.open(url, '_blank');
            clearDownloadUrl();
        }
    };

    const handleSelectHistory = (videoSrc?: string) => {
        if (videoSrc) window.open(videoSrc, '_blank');
    };

    const records = React.useMemo(() => {
        if (!user) return [];
        if (user.role === 'ADMIN' || user.role === 'MODERATOR') {
            return adminVideos.flatMap((video) => video.filenames.map((filename, idx) => ({
                timestamp: tsFromFilename(filename),
                type: filename.includes('_raw') ? '원본' : '모자이크',
                description: filename,
                videoSrc: video.s3Urls[idx],
                filename,
                userId: video.userId,
                isRaw: filename.includes('_raw'),
            })));
        } else {
            return videos
                .filter(v => !v.filename.includes('_raw'))
                .map(v => ({
                    timestamp: tsFromFilename(v.filename),
                    type: '모자이크',
                    description: v.filename,
                    videoSrc: v.s3Url,
                    filename: v.filename,
                }));
        }
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
                onSelectHistory={handleSelectHistory}
                onDownload={handleDownload}
            />
        </div>
    );
};

export default SavedVideosPage;
