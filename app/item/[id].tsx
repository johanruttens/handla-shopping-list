import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Trash2 } from 'lucide-react-native';
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
import { getShoppingItemById } from '../../src/services/database';
import { Unit, Category, ShoppingItem } from '../../src/types';
import { i18n } from '../../src/i18n';

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, typography } = useTheme();
  const language = useAppStore((state) => state.language);
  const { editItem, removeItem } = useShoppingStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [item, setItem] = useState<ShoppingItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState<Unit>('pieces');
  const [category, setCategory] = useState<Category>('other');
  const [isFavorite, setIsFavorite] = useState(false);

  // Ensure i18n is synced
  i18n.locale = language;

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const itemData = await getShoppingItemById(parseInt(id));
      if (itemData) {
        setItem(itemData);
        setName(itemData.name);
        setAmount(itemData.amount);
        setUnit(itemData.unit);
        setCategory(itemData.category);
        setIsFavorite(itemData.isFavorite);
      }
    } catch (error) {
      console.error('Failed to load item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!item || name.trim().length === 0) return;

    setIsSaving(true);
    try {
      await editItem(item.id, {
        name: name.trim(),
        amount,
        unit,
        category,
        isFavorite,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Failed to update item:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!item) return;

    Alert.alert(
      i18n.t('item.deleteItem'),
      i18n.t('item.deleteConfirm'),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await removeItem(item.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            } catch (error) {
              console.error('Failed to delete item:', error);
            }
          },
        },
      ]
    );
  };

  const isValid = name.trim().length > 0;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>{i18n.t('common.error')}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            {i18n.t('item.editItem')}
          </Text>
          <IconButton
            icon={<Trash2 size={20} color={colors.error} />}
            onPress={handleDelete}
            variant="ghost"
          />
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
            title={i18n.t('common.save')}
            onPress={handleSave}
            fullWidth
            size="lg"
            disabled={!isValid}
            loading={isSaving}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
