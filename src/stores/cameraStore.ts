import { create } from 'zustand';

interface CameraState {
  isInitialized: boolean;
  hasPermission: boolean;
  setIsInitialized: (initialized: boolean) => void;
  setHasPermission: (permission: boolean) => void;
  reset: () => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  isInitialized: false,
  hasPermission: false,
  setIsInitialized: (initialized) => set({ isInitialized: initialized }),
  setHasPermission: (permission) => set({ hasPermission: permission }),
  reset: () => set({ isInitialized: false, hasPermission: false }),
})); 