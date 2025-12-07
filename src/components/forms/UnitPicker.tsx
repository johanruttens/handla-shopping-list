import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { Unit } from '../../types';
import { i18n } from '../../i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface UnitPickerProps {
  value: Unit;
  onChange: (unit: Unit) => void;
  label?: string;
}

const units: Unit[] = [
  'pieces',
  'kg',
  'g',
  'l',
  'ml',
  'pack',
  'box',
  'bottle',
  'can',
  'jar',
];

interface UnitChipProps {
  unit: Unit;
  selected: boolean;
  onSelect: () => void;
}

function UnitChip({ unit, selected, onSelect }: UnitChipProps) {
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
    onSelect();
  };

  const label = i18n.t(`units.${unit}Short`);

  return (
    <AnimatedPressable onPress={handlePress} style={animatedStyle}>
      <View
        style={[
          styles.chip,
          {
            backgroundColor: selected ? colors.primary : colors.surface,
            borderRadius: borderRadius.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            marginRight: spacing.sm,
            borderWidth: 1,
            borderColor: selected ? colors.primary : colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.chipText,
            {
              color: selected ? '#FFFFFF' : colors.text,
              fontSize: typography.sizes.sm,
              fontWeight: selected
                ? typography.weights.semibold
                : typography.weights.regular,
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

export function UnitPicker({ value, onChange, label }: UnitPickerProps) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.textSecondary,
              fontSize: typography.sizes.sm,
              fontWeight: typography.weights.medium,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {units.map((unit) => (
          <UnitChip
            key={unit}
            unit={unit}
            selected={value === unit}
            onSelect={() => onChange(unit)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {},
  scrollContent: {
    paddingVertical: 4,
  },
  chip: {},
  chipText: {},
});
