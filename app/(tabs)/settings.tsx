import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { User, Globe, Palette, Trash2, Info } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { Card, TextInput, Button } from '../../src/components/common';
import { SettingsRow } from '../../src/components/screens';
import { useAppStore } from '../../src/store/useAppStore';
import { useShoppingStore } from '../../src/store/useShoppingStore';
import { ThemeMode, Language } from '../../src/types';
import { i18n, languageOptions } from '../../src/i18n';

export default function SettingsScreen() {
  const { colors, spacing, typography, borderRadius } = useTheme();
  const {
    userName,
    language,
    theme,
    updateName,
    updateLanguage,
    updateTheme,
    resetApp,
  } = useAppStore();
  const { refreshAll } = useShoppingStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userName);

  // Ensure i18n is synced
  i18n.locale = language;

  const handleSaveName = async () => {
    if (editedName.trim().length > 0) {
      await updateName(editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleLanguagePress = () => {
    const options = languageOptions.map((lang) => `${lang.flag} ${lang.nativeName}`);
    const cancelButtonIndex = options.length;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...options, i18n.t('common.cancel')],
          cancelButtonIndex,
          title: i18n.t('settings.language'),
        },
        async (buttonIndex) => {
          if (buttonIndex !== cancelButtonIndex) {
            const selectedLang = languageOptions[buttonIndex];
            await updateLanguage(selectedLang.code);
            i18n.locale = selectedLang.code;
          }
        }
      );
    } else {
      // Android fallback using Alert
      const alertOptions = languageOptions.map((lang) => ({
        text: `${lang.flag} ${lang.nativeName}`,
        onPress: async () => {
          await updateLanguage(lang.code);
          i18n.locale = lang.code;
        },
      }));

      Alert.alert(
        i18n.t('settings.language'),
        undefined,
        [...alertOptions, { text: i18n.t('common.cancel'), style: 'cancel' }]
      );
    }
  };

  const handleThemePress = () => {
    const themeOptions: { text: string; value: ThemeMode }[] = [
      { text: i18n.t('settings.themeOptions.light'), value: 'light' },
      { text: i18n.t('settings.themeOptions.dark'), value: 'dark' },
      { text: i18n.t('settings.themeOptions.system'), value: 'system' },
    ];

    Alert.alert(
      i18n.t('settings.theme'),
      undefined,
      [
        ...themeOptions.map((opt) => ({
          text: opt.text,
          onPress: async () => {
            await updateTheme(opt.value);
          },
        })),
        { text: i18n.t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      i18n.t('settings.clearData'),
      i18n.t('settings.clearDataConfirm'),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await resetApp();
            router.replace('/onboarding/language');
          },
        },
      ]
    );
  };

  const getCurrentLanguageName = () => {
    const lang = languageOptions.find((l) => l.code === language);
    return lang ? `${lang.flag} ${lang.nativeName}` : language;
  };

  const getCurrentThemeName = () => {
    return i18n.t(`settings.themeOptions.${theme}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: typography.sizes.xxl,
              fontWeight: typography.weights.bold,
              marginBottom: spacing.lg,
            },
          ]}
        >
          {i18n.t('settings.title')}
        </Text>

        {/* Profile Section */}
        <View style={[styles.section, { marginBottom: spacing.lg }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
                marginBottom: spacing.sm,
                marginLeft: spacing.sm,
              },
            ]}
          >
            {i18n.t('settings.name').toUpperCase()}
          </Text>
          <Card variant="filled" padding="none">
            {isEditingName ? (
              <View style={{ padding: spacing.md }}>
                <TextInput
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder={i18n.t('settings.namePlaceholder')}
                  autoFocus
                />
                <View
                  style={[styles.editButtons, { marginTop: spacing.md, gap: spacing.sm }]}
                >
                  <Button
                    title={i18n.t('common.cancel')}
                    onPress={() => {
                      setEditedName(userName);
                      setIsEditingName(false);
                    }}
                    variant="secondary"
                    size="sm"
                  />
                  <Button
                    title={i18n.t('common.save')}
                    onPress={handleSaveName}
                    size="sm"
                  />
                </View>
              </View>
            ) : (
              <SettingsRow
                icon={<User size={20} color={colors.primary} />}
                title={userName}
                onPress={() => setIsEditingName(true)}
                showChevron
              />
            )}
          </Card>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { marginBottom: spacing.lg }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
                marginBottom: spacing.sm,
                marginLeft: spacing.sm,
              },
            ]}
          >
            {i18n.t('settings.preferences').toUpperCase()}
          </Text>
          <Card variant="filled" padding="none">
            <SettingsRow
              icon={<Globe size={20} color={colors.primary} />}
              title={i18n.t('settings.language')}
              value={getCurrentLanguageName()}
              onPress={handleLanguagePress}
            />
            <View
              style={[
                styles.divider,
                { backgroundColor: colors.border, marginLeft: 52 },
              ]}
            />
            <SettingsRow
              icon={<Palette size={20} color={colors.primary} />}
              title={i18n.t('settings.theme')}
              value={getCurrentThemeName()}
              onPress={handleThemePress}
            />
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { marginBottom: spacing.lg }]}>
          <Card variant="filled" padding="none">
            <SettingsRow
              icon={<Trash2 size={20} color={colors.error} />}
              title={i18n.t('settings.clearData')}
              onPress={handleClearData}
              destructive
              showChevron={false}
            />
          </Card>
          <Text
            style={[
              styles.helperText,
              {
                color: colors.textTertiary,
                fontSize: typography.sizes.xs,
                marginTop: spacing.xs,
                marginLeft: spacing.sm,
              },
            ]}
          >
            {i18n.t('settings.clearDataDescription')}
          </Text>
        </View>

        {/* About Section */}
        <View style={[styles.section, { marginBottom: spacing.lg }]}>
          <Card variant="filled" padding="none">
            <SettingsRow
              icon={<Info size={20} color={colors.textSecondary} />}
              title={i18n.t('settings.version')}
              value="1.0.0"
              showChevron={false}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
  title: {},
  section: {},
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  helperText: {},
});
