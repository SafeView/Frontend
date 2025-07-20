import { useAlertStore } from "../../stores/alertStore";
import styles from "./AlertTable.module.css";

const AlertTable = () => {
    const { alerts } = useAlertStore();

    return (
        <div className={styles.tableWrapper}>
            <h2 className={styles.title}>Recent Alerts</h2>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Camera</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                {alerts.map((alert, i) => (
                    <tr key={i}>
                        <td>{alert.timestamp}</td>
                        <td>{alert.camera}</td>
                        <td>
                            <span className={styles.typeBadge}>{alert.type}</span>
                        </td>
                        <td>{alert.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AlertTable;
