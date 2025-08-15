import { useEffect } from "react";
import SummaryCard from "../components/SummaryCard/SummaryCard";
import AlertTable from "../components/AlertTable/AlertTable";
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
          <SummaryCard title="Total Cameras" value={3} />
          <SummaryCard title="Active Alerts" value={3} />
          <SummaryCard title="System Uptime" value="87.8%" />
        </div>

        <h2 className={styles.sectionTitle}>Live Feeds</h2>
        <AlertTable />
      </div>
    </>
  );
};

export default HomePage;
