import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Heart, Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Favorite } from '../../types';
import { i18n } from '../../i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FavoriteItemRowProps {
  item: Favorite;
  selected: boolean;
  selectionMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export function FavoriteItemRow({
  item,
  selected,
  selectionMode,
  onPress,
  onLongPress,
}: FavoriteItemRowProps) {
  const { colors, borderRadius, typography, spacing, shadows } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress();
  };

  const unitLabel = i18n.t(`units.${item.defaultUnit}Short`);
  const categoryLabel = i18n.t(`categories.${item.category}`);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <View
        style={[
          styles.row,
          {
            backgroundColor: selected
              ? colors.primary + '15'
              : colors.background,
            borderRadius: borderRadius.lg,
            borderWidth: selected ? 2 : 1,
            borderColor: selected ? colors.primary : colors.border,
            ...(!selected && shadows.sm),
          },
        ]}
      >
        {selectionMode && (
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: selected ? colors.primary : 'transparent',
                borderWidth: selected ? 0 : 2,
                borderColor: colors.border,
                borderRadius: borderRadius.full,
                marginRight: spacing.md,
              },
            ]}
          >
            {selected && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
          </View>
        )}

        <Heart
          size={20}
          color={colors.primary}
          fill={colors.primary}
          style={{ marginRight: spacing.md }}
        />

        <View style={styles.content}>
          <Text
            style={[
              styles.name,
              {
                color: colors.text,
                fontSize: typography.sizes.body,
                fontWeight: typography.weights.medium,
              },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View style={styles.metaRow}>
            <Text
              style={[
                styles.amount,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.sm,
                },
              ]}
            >
              {item.defaultAmount} {unitLabel}
            </Text>
            <Text
              style={[
                styles.separator,
                { color: colors.textTertiary, fontSize: typography.sizes.sm },
              ]}
            >
              {' · '}
            </Text>
            <Text
              style={[
                styles.category,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.sm,
                },
              ]}
            >
              {categoryLabel}
            </Text>
          </View>
        </View>

        {item.usageCount > 0 && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.surface,
                borderRadius: borderRadius.full,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: colors.textSecondary,
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.medium,
                },
              ]}
            >
              {item.usageCount}×
            </Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  name: {},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  amount: {},
  separator: {},
  category: {},
  badge: {},
  badgeText: {},
});
