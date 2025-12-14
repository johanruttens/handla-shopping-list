import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
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
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<TextInput>(null);

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
      // Use dynamic step: 0.5 when going below 1, otherwise use the configured step
      const effectiveStep = value <= 1 ? 0.5 : step;
      const newValue = Math.max(min, value - effectiveStep);
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
      // Use dynamic step: 0.5 when below 1, otherwise use the configured step
      // When at 0.5, go to 1 (not 1.5)
      let newValue: number;
      if (value < 1) {
        newValue = Math.min(max, value + 0.5);
        // Snap to whole number if we reach or exceed 1
        if (newValue >= 1) {
          newValue = Math.ceil(newValue);
        }
      } else {
        newValue = Math.min(max, value + step);
      }
      onChange(Number(newValue.toFixed(1)));
    }
  };

  const formatValue = (val: number): string => {
    return val % 1 === 0 ? val.toString() : val.toFixed(1);
  };

  const handleStartEditing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputValue(formatValue(value));
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleEndEditing = () => {
    setIsEditing(false);
    const parsed = parseFloat(inputValue.replace(',', '.'));
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(Number(clamped.toFixed(1)));
    }
  };

  const handleInputChange = (text: string) => {
    // Allow digits, decimal point, and comma (for European input)
    const sanitized = text.replace(/[^0-9.,]/g, '');
    setInputValue(sanitized);
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

        <Pressable style={styles.valueContainer} onPress={handleStartEditing}>
          {isEditing ? (
            <TextInput
              ref={inputRef}
              style={[
                styles.value,
                {
                  color: colors.text,
                  fontSize: typography.sizes.xl,
                  fontWeight: typography.weights.semibold,
                  minWidth: 60,
                  padding: 0,
                },
              ]}
              value={inputValue}
              onChangeText={handleInputChange}
              onBlur={handleEndEditing}
              onSubmitEditing={handleEndEditing}
              keyboardType="decimal-pad"
              selectTextOnFocus
              textAlign="center"
            />
          ) : (
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
          )}
        </Pressable>

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
