import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ToastProps {
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  message,
  action,
  visible,
  onDismiss,
  duration = 4000,
}: ToastProps) {
  const { colors, borderRadius, spacing, typography, shadows } = useTheme();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      opacity.value = withSpring(1);

      // Auto dismiss
      const timeout = setTimeout(() => {
        dismissToast();
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      translateY.value = withSpring(100);
      opacity.value = withSpring(0);
    }
  }, [visible]);

  const dismissToast = () => {
    translateY.value = withSpring(100, { damping: 20, stiffness: 300 });
    opacity.value = withSpring(0, {}, () => {
      runOnJS(onDismiss)();
    });
  };

  const handleAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action?.onPress();
    dismissToast();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.text,
          borderRadius: borderRadius.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          marginHorizontal: spacing.lg,
          ...shadows.lg,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={[
          styles.message,
          {
            color: colors.background,
            fontSize: typography.sizes.body,
          },
        ]}
        numberOfLines={2}
      >
        {message}
      </Text>
      {action && (
        <Pressable onPress={handleAction} hitSlop={10}>
          <Text
            style={[
              styles.action,
              {
                color: colors.primary,
                fontSize: typography.sizes.body,
                fontWeight: typography.weights.semibold,
                marginLeft: spacing.md,
              },
            ]}
          >
            {action.label}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: SCREEN_WIDTH - 32,
    alignSelf: 'center',
  },
  message: {
    flex: 1,
  },
  action: {},
});
