import { create } from 'zustand';
import Cookies from 'js-cookie';

interface SettingsState {
  openrouterApiKey: string;
  setOpenrouterApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  openrouterApiKey: Cookies.get('OPENROUTER_API_KEY') || '',
  setOpenrouterApiKey: (key) => {
    Cookies.set('OPENROUTER_API_KEY', key, { expires: 365 }); // Save for 1 year
    set({ openrouterApiKey: key });
  },
}));
