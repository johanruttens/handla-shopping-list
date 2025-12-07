import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode } from '../types';
import {
  ColorScheme,
  lightColors,
  darkColors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  touchTargets,
} from './index';

interface ThemeContextValue {
  colors: ColorScheme;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  animation: typeof animation;
  touchTargets: typeof touchTargets;
  isDark: boolean;
  themeMode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  themeMode: ThemeMode;
}

export function ThemeProvider({ children, themeMode }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();

  const value = useMemo(() => {
    let isDark: boolean;
    if (themeMode === 'system') {
      isDark = systemColorScheme === 'dark';
    } else {
      isDark = themeMode === 'dark';
    }

    return {
      colors: isDark ? darkColors : lightColors,
      spacing,
      typography,
      borderRadius,
      shadows,
      animation,
      touchTargets,
      isDark,
      themeMode,
    };
  }, [themeMode, systemColorScheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Export a default theme for use outside of React context
export const defaultTheme: ThemeContextValue = {
  colors: lightColors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  touchTargets,
  isDark: false,
  themeMode: 'light',
};
