import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, ThemeMode } from '../types';
import {
  getUserSettings,
  createUserSettings,
  updateUserSettings,
  clearAllData,
} from '../services/database';

interface AppState {
  // User settings
  userName: string;
  language: Language;
  theme: ThemeMode;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;

  // Actions
  setUserName: (name: string) => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  completeOnboarding: (name: string, language: Language) => Promise<void>;
  loadUserSettings: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateLanguage: (language: Language) => Promise<void>;
  updateTheme: (theme: ThemeMode) => Promise<void>;
  resetApp: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      userName: '',
      language: 'en',
      theme: 'system',
      hasCompletedOnboarding: false,
      isLoading: true,

      // Sync actions (for immediate UI updates)
      setUserName: (name) => set({ userName: name }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),

      // Async actions (for database persistence)
      completeOnboarding: async (name, language) => {
        await createUserSettings(name, language);
        set({
          userName: name,
          language,
          hasCompletedOnboarding: true,
        });
      },

      loadUserSettings: async () => {
        set({ isLoading: true });
        try {
          const settings = await getUserSettings();
          if (settings) {
            set({
              userName: settings.name,
              language: settings.language,
              theme: settings.theme,
              hasCompletedOnboarding: true,
            });
          }
        } catch (error) {
          console.error('Failed to load user settings:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateName: async (name) => {
        await updateUserSettings({ name });
        set({ userName: name });
      },

      updateLanguage: async (language) => {
        await updateUserSettings({ language });
        set({ language });
      },

      updateTheme: async (theme) => {
        await updateUserSettings({ theme });
        set({ theme });
      },

      resetApp: async () => {
        await clearAllData();
        set({
          userName: '',
          language: 'en',
          theme: 'system',
          hasCompletedOnboarding: false,
        });
      },
    }),
    {
      name: 'handla-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);
