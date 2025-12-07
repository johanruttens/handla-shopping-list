import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, TextInput, IconButton } from '../../src/components/common';
import {
  AmountSelector,
  UnitPicker,
  CategoryPicker,
  FavoriteToggle,
} from '../../src/components/forms';
import { useShoppingStore } from '../../src/store/useShoppingStore';
import { useAppStore } from '../../src/store/useAppStore';
import { Unit, Category, ShoppingItemFormData } from '../../src/types';
import { i18n } from '../../src/i18n';

export default function AddItemScreen() {
  const { colors, spacing, typography } = useTheme();
  const language = useAppStore((state) => state.language);
  const addItem = useShoppingStore((state) => state.addItem);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState<Unit>('pieces');
  const [category, setCategory] = useState<Category>('other');
  const [isFavorite, setIsFavorite] = useState(false);

  // Ensure i18n is synced
  i18n.locale = language;

  const handleClose = () => {
    router.back();
  };

  const handleSave = async () => {
    if (name.trim().length === 0) return;

    setIsLoading(true);
    try {
      const formData: ShoppingItemFormData = {
        name: name.trim(),
        amount,
        unit,
        category,
        isFavorite,
      };
      await addItem(formData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Failed to add item:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            },
          ]}
        >
          <IconButton
            icon={<X size={24} color={colors.text} />}
            onPress={handleClose}
            variant="ghost"
          />
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: typography.sizes.lg,
                fontWeight: typography.weights.semibold,
              },
            ]}
          >
            {i18n.t('item.addItem')}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name Input */}
          <View style={[styles.field, { marginBottom: spacing.lg }]}>
            <TextInput
              label={i18n.t('item.name')}
              placeholder={i18n.t('item.namePlaceholder')}
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="sentences"
            />
          </View>

          {/* Amount Selector */}
          <View style={[styles.field, { marginBottom: spacing.lg }]}>
            <AmountSelector
              label={i18n.t('item.amount')}
              value={amount}
              onChange={setAmount}
            />
          </View>

          {/* Unit Picker */}
          <View style={[styles.field, { marginBottom: spacing.lg }]}>
            <UnitPicker
              label={i18n.t('item.unit')}
              value={unit}
              onChange={setUnit}
            />
          </View>

          {/* Category Picker */}
          <View style={[styles.field, { marginBottom: spacing.lg }]}>
            <CategoryPicker
              label={i18n.t('item.category')}
              value={category}
              onChange={setCategory}
            />
          </View>

          {/* Favorite Toggle */}
          <View style={[styles.field, { marginBottom: spacing.xl }]}>
            <FavoriteToggle
              label={i18n.t('item.favorite')}
              value={isFavorite}
              onChange={setIsFavorite}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              borderTopColor: colors.border,
              padding: spacing.lg,
              paddingBottom: spacing.lg + 20,
            },
          ]}
        >
          <Button
            title={i18n.t('common.add')}
            onPress={handleSave}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  title: {},
  scrollView: {
    flex: 1,
  },
  content: {},
  field: {},
  footer: {
    borderTopWidth: 1,
  },
});
