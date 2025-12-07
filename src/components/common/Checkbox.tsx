import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export function Checkbox({
  checked,
  onToggle,
  size = 24,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
}: CheckboxProps) {
  const { colors, borderRadius } = useTheme();
  const scale = useSharedValue(1);
  const progress = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 300,
    });
  }, [checked]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', colors.primary]
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.primary]
    );
    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedCheckStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  const handlePress = () => {
    if (!disabled) {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
      setTimeout(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      }, 100);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggle();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: borderRadius.sm,
            borderWidth: 2,
            opacity: disabled ? 0.5 : 1,
          },
          animatedContainerStyle,
          style,
        ]}
      >
        <Animated.View style={animatedCheckStyle}>
          <Check size={size - 8} color="#FFFFFF" strokeWidth={3} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
