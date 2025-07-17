import styles from './ReportsPage.module.css';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';

const summaryStats = [
    { label: '오늘 알림 수', value: 12 },
    { label: '주간 알림 증가율', value: '+25%' },
    { label: '카메라 가동률', value: '98.2%' },
];

const weeklyData = [
    { day: '월', alerts: 5 },
    { day: '화', alerts: 7 },
    { day: '수', alerts: 4 },
    { day: '목', alerts: 9 },
    { day: '금', alerts: 6 },
    { day: '토', alerts: 3 },
    { day: '일', alerts: 2 },
];

const cameraData = [
    { camera: 'Entrance 1', count: 8 },
    { camera: 'Parking Lot', count: 5 },
    { camera: 'Back Door', count: 3 },
    { camera: 'Front Desk', count: 2 },
];

const alertTypeData = [
    { type: 'Intrusion', value: 10 },
    { type: 'Loitering', value: 6 },
    { type: 'Fight', value: 2 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const ReportsPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>📊 Reports</h1>
            <p className={styles.subtitle}>일일 / 주간 / 월간 감시 보고서를 확인하세요.</p>

            <div className={styles.cardRow}>
                {summaryStats.map((stat, i) => (
                    <div className={styles.card} key={i}>
                        <p className={styles.cardLabel}>{stat.label}</p>
                        <h2 className={styles.cardValue}>{stat.value}</h2>
                    </div>
                ))}
            </div>

            <div className={styles.chartRow}>
                <div className={styles.chartBox}>
                    <h3 className={styles.chartTitle}>📈 주간 알림 추이</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyData}>
                            <Line type="monotone" dataKey="alerts" stroke="#4fc3f7" strokeWidth={2} />
                            <CartesianGrid stroke="#2a2e39" />
                            <XAxis dataKey="day" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.chartBox}>
                    <h3 className={styles.chartTitle}>📊 카메라별 알림 건수</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={cameraData}>
                            <Bar dataKey="count" fill="#f06292" radius={[8, 8, 0, 0]} />
                            <CartesianGrid stroke="#2a2e39" />
                            <XAxis dataKey="camera" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.chartBox}>
                    <h3 className={styles.chartTitle}>🎯 알림 유형 분포</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={alertTypeData}
                                dataKey="value"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                {alertTypeData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
