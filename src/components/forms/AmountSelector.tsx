import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AmountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function AmountSelector({
  value,
  onChange,
  min = 0.5,
  max = 999,
  step = 1,
  label,
}: AmountSelectorProps) {
  const { colors, borderRadius, typography, spacing, touchTargets } = useTheme();
  const minusScale = useSharedValue(1);
  const plusScale = useSharedValue(1);

  const minusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: minusScale.value }],
  }));

  const plusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));

  const handleDecrease = () => {
    if (value > min) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      minusScale.value = withSpring(0.9, { damping: 15 });
      setTimeout(() => {
        minusScale.value = withSpring(1, { damping: 15 });
      }, 100);
      const newValue = Math.max(min, value - step);
      onChange(Number(newValue.toFixed(1)));
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      plusScale.value = withSpring(0.9, { damping: 15 });
      setTimeout(() => {
        plusScale.value = withSpring(1, { damping: 15 });
      }, 100);
      const newValue = Math.min(max, value + step);
      onChange(Number(newValue.toFixed(1)));
    }
  };

  const formatValue = (val: number): string => {
    return val % 1 === 0 ? val.toString() : val.toFixed(1);
  };

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
      <View
        style={[
          styles.selectorContainer,
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: colors.border,
          },
        ]}
      >
        <AnimatedPressable
          onPress={handleDecrease}
          disabled={value <= min}
          style={[
            styles.button,
            {
              width: touchTargets.min,
              height: touchTargets.min,
              opacity: value <= min ? 0.3 : 1,
            },
            minusAnimatedStyle,
          ]}
        >
          <Minus size={20} color={colors.text} strokeWidth={2} />
        </AnimatedPressable>

        <View style={styles.valueContainer}>
          <Text
            style={[
              styles.value,
              {
                color: colors.text,
                fontSize: typography.sizes.xl,
                fontWeight: typography.weights.semibold,
              },
            ]}
          >
            {formatValue(value)}
          </Text>
        </View>

        <AnimatedPressable
          onPress={handleIncrease}
          disabled={value >= max}
          style={[
            styles.button,
            {
              width: touchTargets.min,
              height: touchTargets.min,
              opacity: value >= max ? 0.3 : 1,
            },
            plusAnimatedStyle,
          ]}
        >
          <Plus size={20} color={colors.text} strokeWidth={2} />
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {},
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    textAlign: 'center',
  },
});
