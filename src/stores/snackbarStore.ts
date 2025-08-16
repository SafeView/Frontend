// stores/snackbarStore.ts
import { create } from 'zustand';

export type SnackbarMessage = {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error';
};

interface SnackbarState {
    snackbarQueue: SnackbarMessage[];
    enqueueSnackbar: (msg: Omit<SnackbarMessage, 'id'>) => void;
    removeSnackbar: (id: number) => void;
    clearAll: () => void;
}

let snackbarId = 0;

export const useSnackbarStore = create<SnackbarState>((set) => ({
    snackbarQueue: [],

    enqueueSnackbar: (msg) =>
        set((state) => ({
            snackbarQueue: [...state.snackbarQueue, { ...msg, id: snackbarId++ }]
        })),

    removeSnackbar: (id) =>
        set((state) => ({
            snackbarQueue: state.snackbarQueue.filter((m) => m.id !== id)
        })),

    clearAll: () =>
        set({ snackbarQueue: [] })
}));
