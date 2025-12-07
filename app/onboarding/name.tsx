import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, TextInput } from '../../src/components/common';
import { useAppStore } from '../../src/store/useAppStore';
import { i18n } from '../../src/i18n';

export default function NameScreen() {
  const { colors, typography, spacing } = useTheme();
  const language = useAppStore((state) => state.language);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ensure correct language is set
  i18n.locale = language;

  const handleContinue = async () => {
    if (name.trim().length < 1) return;

    setIsLoading(true);
    try {
      await completeOnboarding(name.trim(), language);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = name.trim().length >= 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.content, { padding: spacing.lg }]}>
          <View style={styles.header}>
            <Text
              style={[
                styles.emoji,
                {
                  fontSize: 64,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              👋
            </Text>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontSize: typography.sizes.xxl,
                  fontWeight: typography.weights.bold,
                  marginBottom: spacing.sm,
                },
              ]}
            >
              {i18n.t('onboarding.whatsYourName')}
            </Text>
          </View>

          <View style={[styles.inputContainer, { marginTop: spacing.xl }]}>
            <TextInput
              placeholder={i18n.t('onboarding.namePlaceholder')}
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              testID="name-input"
            />
          </View>
        </View>

        <View style={[styles.footer, { padding: spacing.lg }]}>
          <Button
            title={i18n.t('onboarding.letsGo')}
            onPress={handleContinue}
            fullWidth
            size="lg"
            disabled={!isValid}
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emoji: {},
  title: {
    textAlign: 'center',
  },
  inputContainer: {},
  footer: {
    paddingBottom: 20,
  },
});
