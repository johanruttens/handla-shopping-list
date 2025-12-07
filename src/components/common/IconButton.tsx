import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type IconButtonVariant = 'filled' | 'outlined' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  color,
  backgroundColor,
  style,
  testID,
  accessibilityLabel,
}: IconButtonProps) {
  const { colors, borderRadius, touchTargets } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 36;
      case 'lg':
        return 56;
      default:
        return touchTargets.min;
    }
  };

  const getBackgroundColor = (): string => {
    if (backgroundColor) return backgroundColor;
    if (disabled) return colors.surfaceSecondary;
    switch (variant) {
      case 'filled':
        return colors.primary;
      case 'outlined':
        return 'transparent';
      case 'ghost':
      default:
        return 'transparent';
    }
  };

  const getBorderWidth = () => {
    return variant === 'outlined' ? 1 : 0;
  };

  const buttonSize = getSize();

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: borderRadius.full,
          backgroundColor: getBackgroundColor(),
          borderWidth: getBorderWidth(),
          borderColor: colors.border,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {icon}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
