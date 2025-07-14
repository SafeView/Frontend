import React from 'react';

interface SummaryCardProps {
    title: string;
    value: string | number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => (
    <div style={{ padding: '1rem', background: '#1f1f1f', color: 'white', borderRadius: 8 }}>
        <p style={{ fontSize: '14px', marginBottom: '0.3rem' }}>{title}</p>
        <h2>{value}</h2>
    </div>
);

export default SummaryCard;
