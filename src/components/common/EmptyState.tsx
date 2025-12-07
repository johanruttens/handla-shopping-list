import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  style,
}: EmptyStateProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.sizes.lg,
            fontWeight: typography.weights.semibold,
            marginTop: icon ? spacing.md : 0,
          },
        ]}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
              fontSize: typography.sizes.body,
              marginTop: spacing.sm,
            },
          ]}
        >
          {description}
        </Text>
      )}
      {action && (
        <View style={[styles.actionContainer, { marginTop: spacing.lg }]}>
          {action}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    opacity: 0.6,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 280,
  },
  actionContainer: {},
});
