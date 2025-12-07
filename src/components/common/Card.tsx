import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  style,
  variant = 'elevated',
  padding = 'md',
}: CardProps) {
  const { colors, borderRadius, shadows, spacing } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return spacing.sm;
      case 'lg':
        return spacing.lg;
      default:
        return spacing.md;
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.surface,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: colors.background,
          ...shadows.md,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: borderRadius.lg,
          padding: getPadding(),
        },
        getVariantStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
