// Theme configuration - Minimalist B&O/Apple-inspired design

import { ThemeMode } from '../types';

// Light mode colors
export const lightColors = {
  primary: '#FF6B6B', // Warm Coral
  primaryLight: '#FF8585',
  secondary: '#5856D6',
  background: '#FFFFFF',
  surface: '#F5F5F7',
  surfaceSecondary: '#E5E5EA',
  text: '#1D1D1F',
  textSecondary: '#86868B',
  textTertiary: '#AEAEB2',
  border: '#D2D2D7',
  borderLight: '#E5E5EA',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

// Dark mode colors
export const darkColors = {
  primary: '#FF8585', // Lighter Coral for dark mode
  primaryLight: '#FF9999',
  secondary: '#5E5CE6',
  background: '#000000',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  text: '#F5F5F7',
  textSecondary: '#98989D',
  textTertiary: '#636366',
  border: '#38383A',
  borderLight: '#2C2C2E',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export type ColorScheme = typeof lightColors;

// Spacing scale (in pixels)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography configuration
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    body: 17, // iOS standard body
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 32,
    hero: 34, // Large headers
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Border radius values
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

// Shadow configurations
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Animation timings
export const animation = {
  fast: 150,
  normal: 250,
  slow: 400,
};

// Touch target minimums
export const touchTargets = {
  min: 44, // iOS HIG minimum
  comfortable: 48,
};

// Deprecated: for backwards compatibility
export const colors = lightColors;

// Helper to get colors based on theme mode
export function getColors(mode: ThemeMode, systemColorScheme: 'light' | 'dark'): ColorScheme {
  if (mode === 'system') {
    return systemColorScheme === 'dark' ? darkColors : lightColors;
  }
  return mode === 'dark' ? darkColors : lightColors;
}

// Full theme object
export const theme = {
  lightColors,
  darkColors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  touchTargets,
};

export type Theme = typeof theme;
