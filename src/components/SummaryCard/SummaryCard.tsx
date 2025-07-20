import React from "react";
import styles from "./SummaryCard.module.css";

interface SummaryCardProps {
    title: string;
    value: string | number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => (
    <div className={styles.card}>
        <p className={styles.title}>{title}</p>
        <h2 className={styles.value}>{value}</h2>
    </div>
);

export default SummaryCard;
