import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

interface FavoriteToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  showLabel?: boolean;
}

export function FavoriteToggle({
  value,
  onChange,
  label,
  showLabel = true,
}: FavoriteToggleProps) {
  const { colors, borderRadius, typography, spacing } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
    Haptics.impactAsync(
      value
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    );
    onChange(!value);
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: value ? colors.primary + '15' : colors.surface,
            borderRadius: borderRadius.md,
            borderWidth: 1,
            borderColor: value ? colors.primary : colors.border,
            padding: spacing.md,
          },
        ]}
      >
        <Animated.View style={animatedStyle}>
          <Heart
            size={24}
            color={value ? colors.primary : colors.textSecondary}
            fill={value ? colors.primary : 'transparent'}
            strokeWidth={2}
          />
        </Animated.View>
        {showLabel && (
          <Text
            style={[
              styles.label,
              {
                color: value ? colors.primary : colors.textSecondary,
                fontSize: typography.sizes.body,
                fontWeight: value
                  ? typography.weights.medium
                  : typography.weights.regular,
                marginLeft: spacing.sm,
              },
            ]}
          >
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {},
});
