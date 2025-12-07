import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { Language } from '../../types';
import { languageOptions } from '../../i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
}

interface LanguageButtonProps {
  language: (typeof languageOptions)[0];
  selected: boolean;
  onSelect: () => void;
}

function LanguageButton({ language, selected, onSelect }: LanguageButtonProps) {
  const { colors, borderRadius, typography, spacing, shadows } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.buttonWrapper, animatedStyle]}
    >
      <View
        style={[
          styles.languageButton,
          {
            backgroundColor: selected ? colors.primary : colors.background,
            borderRadius: borderRadius.lg,
            borderWidth: selected ? 0 : 1,
            borderColor: colors.border,
            padding: spacing.md,
            ...(selected ? {} : shadows.sm),
          },
        ]}
      >
        <Text style={styles.flag}>{language.flag}</Text>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.nativeName,
              {
                color: selected ? '#FFFFFF' : colors.text,
                fontSize: typography.sizes.body,
                fontWeight: typography.weights.semibold,
              },
            ]}
          >
            {language.nativeName}
          </Text>
          <Text
            style={[
              styles.name,
              {
                color: selected ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
                fontSize: typography.sizes.sm,
              },
            ]}
          >
            {language.name}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const { spacing } = useTheme();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.container, { gap: spacing.sm }]}
      showsVerticalScrollIndicator={false}
    >
      {languageOptions.map((language) => (
        <LanguageButton
          key={language.code}
          language={language}
          selected={value === language.code}
          onSelect={() => onChange(language.code)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    width: '100%',
    paddingBottom: 20,
  },
  buttonWrapper: {},
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  nativeName: {},
  name: {},
});
