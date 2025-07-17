import styles from './AlertsPage.module.css';

const dummyAlerts = [
    {
        id: 1,
        timestamp: '2025-07-17 13:24',
        camera: 'Entrance 1',
        type: 'Intrusion',
        severity: 'High',
        description: 'Unauthorized person entered through main gate',
        thumbnail: '/assets/cam1.png',
    },
    {
        id: 2,
        timestamp: '2025-07-17 12:02',
        camera: 'Parking Lot',
        type: 'Loitering',
        severity: 'Medium',
        description: 'Person loitering for over 10 minutes',
        thumbnail: '/assets/cam2.png',
    },
    {
        id: 3,
        timestamp: '2025-07-16 22:10',
        camera: 'Back Door',
        type: 'Fight',
        severity: 'High',
        description: 'Detected physical altercation between individuals',
        thumbnail: '/assets/cam3.png',
    },
];

const AlertsPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>📢 Alerts</h1>
            <table className={styles.alertTable}>
                <thead>
                <tr>
                    <th>Time</th>
                    <th>Camera</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Description</th>
                    <th>Snapshot</th>
                </tr>
                </thead>
                <tbody>
                {dummyAlerts.map((alert) => (
                    <tr key={alert.id}>
                        <td>{alert.timestamp}</td>
                        <td>{alert.camera}</td>
                        <td>{alert.type}</td>
                        <td>
                <span
                    className={`${styles.severity} ${styles[alert.severity.toLowerCase()]}`}
                >
                  {alert.severity}
                </span>
                        </td>
                        <td>{alert.description}</td>
                        <td>
                            <img src={alert.thumbnail} alt="snapshot" className={styles.thumbnail} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AlertsPage;
