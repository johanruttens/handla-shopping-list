import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { i18n, getRandomGreeting } from '../../i18n';

interface GreetingHeaderProps {
  userName: string;
  refreshTrigger?: number;
}

export function GreetingHeader({
  userName,
  refreshTrigger = 0,
}: GreetingHeaderProps) {
  const { colors, typography, spacing } = useTheme();
  const [funnyGreeting, setFunnyGreeting] = useState('');
  const greetingOpacity = useSharedValue(0);
  const greetingTranslateY = useSharedValue(10);

  useEffect(() => {
    // Animate out
    greetingOpacity.value = 0;
    greetingTranslateY.value = 10;

    // Set new greeting
    setFunnyGreeting(getRandomGreeting(userName));

    // Animate in
    greetingOpacity.value = withDelay(100, withSpring(1, { damping: 20 }));
    greetingTranslateY.value = withDelay(100, withSpring(0, { damping: 20 }));
  }, [userName, refreshTrigger]);

  const animatedGreetingStyle = useAnimatedStyle(() => ({
    opacity: greetingOpacity.value,
    transform: [{ translateY: greetingTranslateY.value }],
  }));

  const greeting = i18n.t('home.greeting', { name: userName });

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.lg }]}>
      <Text
        style={[
          styles.greeting,
          {
            color: colors.text,
            fontSize: typography.sizes.hero,
            fontWeight: typography.weights.bold,
          },
        ]}
      >
        {greeting}
      </Text>
      <Animated.Text
        style={[
          styles.funnyGreeting,
          {
            color: colors.textSecondary,
            fontSize: typography.sizes.body,
            marginTop: spacing.xs,
          },
          animatedGreetingStyle,
        ]}
      >
        {funnyGreeting}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {},
  funnyGreeting: {},
});
