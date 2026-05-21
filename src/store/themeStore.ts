import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface ThemeState {
  isDark: boolean;
  hydrated: boolean;
  toggleTheme: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: true,
  hydrated: false,

  toggleTheme: async () => {
    const newValue = !get().isDark;
    set({ isDark: newValue });
    await SecureStore.setItemAsync("theme", newValue ? "dark" : "light");
  },

  hydrate: async () => {
    try {
      const saved = await SecureStore.getItemAsync("theme");
      if (saved) {
        set({ isDark: saved === "dark", hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },
}));

export default useThemeStore;
