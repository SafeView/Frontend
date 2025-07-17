import { useEffect } from "react";
import SummaryCard from "../components/SummaryCard";
import AlertTable from "../components/AlertTable";
import { useAlertStore } from "../stores/alertStore";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const { fetchAlerts } = useAlertStore();

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.heading}>Overview</h1>

        <div className={styles.cardRow}>
          <SummaryCard title="Total Cameras" value={12} />
          <SummaryCard title="Active Alerts" value={3} />
          <SummaryCard title="System Uptime" value="99.8%" />
        </div>

        <h2 className={styles.sectionTitle}>Live Feeds</h2>
        {/* <CameraFeed /> */}
        <AlertTable />
      </div>
    </>
  );
};

export default HomePage;
