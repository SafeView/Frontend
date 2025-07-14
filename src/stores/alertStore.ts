import { create } from 'zustand';
import type {Alert} from '../types/alert';

interface AlertStore {
    alerts: Alert[];
    fetchAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
    alerts: [],
    fetchAlerts: () =>
        set({
            alerts: [
                {
                    timestamp: '2024-01-20 14:30',
                    camera: 'Entrance 1',
                    type: 'Intrusion',
                    description: 'Person detected in restricted area',
                },
                {
                    timestamp: '2024-01-20 13:15',
                    camera: 'Parking Lot',
                    type: 'Suspicious Activity',
                    description: 'Unusual vehicle movement',
                },
            ],
        }),
}));
