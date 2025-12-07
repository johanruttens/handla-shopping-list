import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button } from '../../src/components/common';
import { LanguageSelector } from '../../src/components/forms';
import { Language } from '../../src/types';
import { useAppStore } from '../../src/store/useAppStore';
import { i18n, getDeviceLocale } from '../../src/i18n';

export default function LanguageScreen() {
  const { colors, typography, spacing } = useTheme();
  const setLanguage = useAppStore((state) => state.setLanguage);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    getDeviceLocale()
  );

  // Update i18n locale for preview
  i18n.locale = selectedLanguage;

  const handleContinue = () => {
    setLanguage(selectedLanguage);
    i18n.locale = selectedLanguage;
    router.push('/onboarding/name');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
            🌍
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
            {i18n.t('onboarding.selectLanguage')}
          </Text>
        </View>

        <View style={[styles.selectorContainer, { marginTop: spacing.xl }]}>
          <LanguageSelector
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />
        </View>
      </View>

      <View style={[styles.footer, { padding: spacing.lg }]}>
        <Button
          title={i18n.t('common.next')}
          onPress={handleContinue}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  selectorContainer: {
    flex: 1,
  },
  footer: {
    paddingBottom: 20,
  },
});
