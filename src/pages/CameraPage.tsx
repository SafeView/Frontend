import { useState } from "react";
import styles from "./CameraPage.module.css";

const dummyCameras = [
    { id: 1, name: "Entrance 1", location: "Main Gate", videoSrc: "/videos/cam1.mp4" },
    { id: 2, name: "Parking Lot", location: "Lot A", videoSrc: "/videos/cam2.mp4" },
    { id: 3, name: "Back Door", location: "Rear Exit", videoSrc: "/videos/cam3.mp4" },
    { id: 4, name: "Front Desk", location: "Lobby", videoSrc: "/videos/cam4.mp4" },
];

const dummyHistory = {
    1: [
        { timestamp: "2024-07-16 10:30", type: "Intrusion", description: "Person detected" },
        { timestamp: "2024-07-15 09:15", type: "Motion", description: "Motion near gate" },
    ],
    2: [
        { timestamp: "2024-07-16 14:00", type: "Suspicious Activity", description: "Car loitering" },
    ],
    3: [],
    4: [
        { timestamp: "2024-07-15 11:00", type: "Crowd", description: "Multiple people detected" },
    ],
};

const CameraPage = () => {
    const [selectedCamera, setSelectedCamera] = useState(dummyCameras[0]);
    const history = dummyHistory[selectedCamera.id] || [];

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h2 className={styles.title}>Cameras</h2>
                <ul className={styles.cameraList}>
                    {dummyCameras.map((cam) => (
                        <li
                            key={cam.id}
                            className={`${styles.cameraItem} ${
                                cam.id === selectedCamera.id ? styles.active : ""
                            }`}
                            onClick={() => setSelectedCamera(cam)}
                        >
                            <span className={styles.cameraName}>{cam.name}</span>
                            <span className={styles.location}>{cam.location}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            <main className={styles.videoPanel}>
                <h2 className={styles.videoTitle}>{selectedCamera.name} - Live View</h2>
                <video
                    src={selectedCamera.videoSrc}
                    className={styles.videoPlayer}
                    controls
                    autoPlay
                    muted
                />

                <h3 className={styles.historyTitle}>Recording History</h3>
                <table className={styles.historyTable}>
                    <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.length > 0 ? (
                        history.map((record, idx) => (
                            <tr key={idx}>
                                <td>{record.timestamp}</td>
                                <td>{record.type}</td>
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
