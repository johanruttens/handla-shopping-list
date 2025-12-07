import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

interface SettingsRowProps {
  icon?: React.ReactNode;
  title: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  rightElement?: React.ReactNode;
}

export function SettingsRow({
  icon,
  title,
  value,
  onPress,
  showChevron = true,
  destructive = false,
  disabled = false,
  rightElement,
}: SettingsRowProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const handlePress = () => {
    if (onPress && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const content = (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.background,
          borderRadius: borderRadius.lg,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {icon && <View style={[styles.iconContainer, { marginRight: spacing.md }]}>{icon}</View>}

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: destructive ? colors.error : colors.text,
              fontSize: typography.sizes.body,
              fontWeight: typography.weights.regular,
            },
          ]}
        >
          {title}
        </Text>
      </View>

      {rightElement ? (
        rightElement
      ) : (
        <>
          {value && (
            <Text
              style={[
                styles.value,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.body,
                  marginRight: spacing.sm,
                },
              ]}
            >
              {value}
            </Text>
          )}
          {showChevron && onPress && (
            <ChevronRight size={20} color={colors.textTertiary} />
          )}
        </>
      )}
    </View>
  );

  if (onPress && !disabled) {
    return <Pressable onPress={handlePress}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {},
  content: {
    flex: 1,
  },
  title: {},
  value: {},
});
