import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  color: string;
}

const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'];
const NUM_CONFETTI = 30;

function generateConfetti(): ConfettiPiece[] {
  return Array.from({ length: NUM_CONFETTI }, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 500,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  }));
}

function ConfettiParticle({ piece }: { piece: ConfettiPiece }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      piece.delay,
      withTiming(SCREEN_HEIGHT + 50, {
        duration: 2000 + Math.random() * 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    translateX.value = withDelay(
      piece.delay,
      withSequence(
        withTiming((Math.random() - 0.5) * 100, { duration: 500 }),
        withTiming((Math.random() - 0.5) * 100, { duration: 500 }),
        withTiming((Math.random() - 0.5) * 100, { duration: 500 }),
        withTiming((Math.random() - 0.5) * 100, { duration: 500 })
      )
    );
    rotation.value = withDelay(
      piece.delay,
      withTiming(360 * 3, { duration: 2500 })
    );
    opacity.value = withDelay(
      piece.delay + 1500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: piece.x,
          backgroundColor: piece.color,
        },
        animatedStyle,
      ]}
    />
  );
}

interface CelebrationOverlayProps {
  visible: boolean;
  onDismiss: () => void;
  message?: string;
}

export function CelebrationOverlay({
  visible,
  onDismiss,
  message = 'All done!',
}: CelebrationOverlayProps) {
  const { colors, typography, spacing } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const confetti = React.useMemo(() => generateConfetti(), [visible]);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );

      // Auto dismiss after 3 seconds
      const timeout = setTimeout(() => {
        handleDismiss();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const handleDismiss = () => {
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onDismiss)();
    });
    scale.value = withTiming(0.8, { duration: 300 });
  };

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Pressable style={styles.dismissArea} onPress={handleDismiss}>
        {confetti.map((piece) => (
          <ConfettiParticle key={piece.id} piece={piece} />
        ))}
        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.emoji}>🎉</Text>
          <Text
            style={[
              styles.message,
              {
                color: colors.text,
                fontSize: typography.sizes.xxl,
                fontWeight: typography.weights.bold,
              },
            ]}
          >
            {message}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.body,
                marginTop: spacing.sm,
              },
            ]}
          >
            Tap to dismiss
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dismissArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
