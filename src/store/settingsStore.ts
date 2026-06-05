import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  openrouterApiKey: string;
  setOpenrouterApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      openrouterApiKey: '',
      setOpenrouterApiKey: (key) => set({ openrouterApiKey: key }),
    }),
    {
      name: 'flipkart-genie-settings',
    }
  )
);
