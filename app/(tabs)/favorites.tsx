import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  Alert,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, EmptyState, Toast } from '../../src/components/common';
import { FavoriteItemRow } from '../../src/components/screens';
import { useShoppingStore, AddItemResult } from '../../src/store/useShoppingStore';
import { useAppStore } from '../../src/store/useAppStore';
import { Favorite } from '../../src/types';
import { i18n } from '../../src/i18n';

export default function FavoritesScreen() {
  const { colors, spacing, typography } = useTheme();
  const language = useAppStore((state) => state.language);
  const { favorites, loadFavorites, removeFavorite, addFavoritesToList } =
    useShoppingStore();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Ensure i18n is synced
  i18n.locale = language;

  const showToastForResults = useCallback((results: AddItemResult[]) => {
    // Show toast for any merged or special cases
    const specialResults = results.filter(r => r.toastMessage);
    if (specialResults.length > 0) {
      // Show the first special result
      const result = specialResults[0];
      if (result.toastMessage) {
        const message = i18n.t(result.toastMessage.message, {
          name: result.item.name,
          quantity: result.item.amount,
        });
        setToastMessage(message);
        setShowToast(true);
      }
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleItemPress = useCallback(
    (item: Favorite) => {
      if (selectionMode) {
        setSelectedIds((prev) =>
          prev.includes(item.id)
            ? prev.filter((id) => id !== item.id)
            : [...prev, item.id]
        );
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [selectionMode]
  );

  const handleItemLongPress = useCallback(
    (item: Favorite) => {
      if (!selectionMode) {
        Alert.alert(
          i18n.t('favorites.removeFromFavorites'),
          i18n.t('favorites.removeConfirm'),
          [
            {
              text: i18n.t('common.cancel'),
              style: 'cancel',
            },
            {
              text: i18n.t('common.delete'),
              style: 'destructive',
              onPress: async () => {
                await removeFavorite(item.id);
              },
            },
          ]
        );
      }
    },
    [selectionMode, removeFavorite]
  );

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((prev) => !prev);
    setSelectedIds([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleAddToList = useCallback(async () => {
    if (selectedIds.length === 0) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const results = await addFavoritesToList(selectedIds);
    showToastForResults(results);
    setSelectedIds([]);
    setSelectionMode(false);
  }, [selectedIds, addFavoritesToList, showToastForResults]);

  const handleRemoveSelected = useCallback(() => {
    if (selectedIds.length === 0) return;

    Alert.alert(
      i18n.t('favorites.removeSelected'),
      i18n.t('favorites.removeSelectedConfirm', { count: selectedIds.length }),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            for (const id of selectedIds) {
              await removeFavorite(id);
            }
            setSelectedIds([]);
            setSelectionMode(false);
          },
        },
      ]
    );
  }, [selectedIds, removeFavorite]);

  const renderItem = useCallback(
    ({ item }: { item: Favorite }) => (
      <FavoriteItemRow
        item={item}
        selected={selectedIds.includes(item.id)}
        selectionMode={selectionMode}
        onPress={() => handleItemPress(item)}
        onLongPress={() => handleItemLongPress(item)}
      />
    ),
    [selectedIds, selectionMode, handleItemPress, handleItemLongPress]
  );

  const keyExtractor = useCallback((item: Favorite) => item.id.toString(), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { padding: spacing.lg }]}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: typography.sizes.xxl,
                fontWeight: typography.weights.bold,
              },
            ]}
          >
            {i18n.t('favorites.title')}
          </Text>
          {favorites.length > 0 && (
            <Button
              title={
                selectionMode
                  ? i18n.t('common.cancel')
                  : i18n.t('favorites.selectItems')
              }
              onPress={toggleSelectionMode}
              variant="ghost"
              size="sm"
            />
          )}
        </View>
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          icon={
            <Heart size={64} color={colors.textTertiary} strokeWidth={1} />
          }
          title={i18n.t('favorites.empty')}
          description={i18n.t('favorites.emptyDescription')}
          style={{ flex: 1 }}
        />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingHorizontal: spacing.lg,
              paddingBottom: selectionMode ? 100 : spacing.xxl,
            },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectionMode && selectedIds.length > 0 && (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              padding: spacing.lg,
            },
          ]}
        >
          <View style={styles.footerButtons}>
            <Button
              title={i18n.t('favorites.removeSelected')}
              onPress={handleRemoveSelected}
              variant="secondary"
              size="lg"
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <Button
              title={i18n.t('favorites.addSelected', { count: selectedIds.length })}
              onPress={handleAddToList}
              size="lg"
              style={{ flex: 1, marginLeft: spacing.sm }}
            />
          </View>
        </View>
      )}

      <Toast
        message={toastMessage}
        visible={showToast}
        onDismiss={() => setShowToast(false)}
        duration={3000}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {},
  listContent: {
    paddingTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingBottom: 34,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
