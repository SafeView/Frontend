import { useAlertStore } from '../stores/alertStore';

const AlertTable = () => {
    const { alerts } = useAlertStore();

    return (
        <table style={{ width: '100%', color: 'white', borderCollapse: 'collapse' }}>
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
                    <td>{alert.type}</td>
                    <td>{alert.description}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AlertTable;
