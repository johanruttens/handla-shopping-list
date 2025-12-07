import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { initDatabase } from '../src/services/database';
import { useAppStore } from '../src/store/useAppStore';
import { useShoppingStore } from '../src/store/useShoppingStore';
import { i18n } from '../src/i18n';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const theme = useAppStore((state) => state.theme);
  const language = useAppStore((state) => state.language);
  const loadUserSettings = useAppStore((state) => state.loadUserSettings);
  const refreshAll = useShoppingStore((state) => state.refreshAll);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize database
        await initDatabase();

        // Load user settings from database
        await loadUserSettings();

        // Load shopping data
        await refreshAll();
      } catch (error) {
        console.error('Error during app initialization:', error);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Sync i18n locale with stored language
  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider themeMode={theme}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
