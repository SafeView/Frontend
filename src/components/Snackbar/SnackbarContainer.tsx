import React, { useEffect } from 'react';
import styles from './SnackbarContainer.module.css';
import { useSnackbarStore } from '../../stores/snackbarStore';

const SnackbarContainer: React.FC = () => {
    const { snackbarQueue, removeSnackbar } = useSnackbarStore();

    useEffect(() => {
        if (snackbarQueue.length === 0) return;

        const timer = setTimeout(() => {
            removeSnackbar(snackbarQueue[0].id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [snackbarQueue]);

    return (
        <div className={styles.container}>
            {snackbarQueue.map((snack) => (
                <div
                    key={snack.id}
                    className={`${styles.snackbar} ${styles[snack.type]}`}
                >
                    {snack.message}
                </div>
            ))}
        </div>
    );
};

export default SnackbarContainer;
