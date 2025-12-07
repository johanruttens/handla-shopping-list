import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { ListFilter } from '../../types';
import { i18n } from '../../i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FilterTabsProps {
  activeFilter: ListFilter;
  onFilterChange: (filter: ListFilter) => void;
  counts?: {
    all: number;
    toBuy: number;
    bought: number;
  };
}

const filters: ListFilter[] = ['all', 'toBuy', 'bought'];

interface TabButtonProps {
  filter: ListFilter;
  active: boolean;
  count?: number;
  onPress: () => void;
}

function TabButton({ filter, active, count, onPress }: TabButtonProps) {
  const { colors, borderRadius, typography, spacing } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const label = i18n.t(`list.tabs.${filter}`);

  return (
    <AnimatedPressable onPress={handlePress} style={[styles.tab, animatedStyle]}>
      <View
        style={[
          styles.tabContent,
          {
            backgroundColor: active ? colors.primary : 'transparent',
            borderRadius: borderRadius.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          },
        ]}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: active ? '#FFFFFF' : colors.textSecondary,
              fontSize: typography.sizes.sm,
              fontWeight: active
                ? typography.weights.semibold
                : typography.weights.regular,
            },
          ]}
        >
          {label}
          {count !== undefined && count > 0 && (
            <Text
              style={{
                color: active ? 'rgba(255,255,255,0.8)' : colors.textTertiary,
              }}
            >
              {' '}
              ({count})
            </Text>
          )}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

export function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: FilterTabsProps) {
  const { colors, borderRadius, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.xs,
        },
      ]}
    >
      {filters.map((filter) => (
        <TabButton
          key={filter}
          filter={filter}
          active={activeFilter === filter}
          count={counts?.[filter]}
          onPress={() => onFilterChange(filter)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
  },
  tabContent: {
    alignItems: 'center',
  },
  tabText: {},
});
