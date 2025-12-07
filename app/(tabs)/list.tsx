import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Plus, ShoppingCart, MoreVertical } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { IconButton, EmptyState, SearchBar, SortPicker, Toast, CelebrationOverlay } from '../../src/components/common';
import { ShoppingItemRow, FilterTabs } from '../../src/components/screens';
import { useShoppingStore } from '../../src/store/useShoppingStore';
import { useAppStore } from '../../src/store/useAppStore';
import { ShoppingItem } from '../../src/types';
import { i18n } from '../../src/i18n';

export default function ListScreen() {
  const { colors, spacing, typography } = useTheme();
  const language = useAppStore((state) => state.language);
  const {
    filter,
    stats,
    searchQuery,
    sortBy,
    sortDirection,
    deletedItems,
    showCelebration,
    setFilter,
    setSearchQuery,
    setSortBy,
    setSortDirection,
    loadItems,
    loadStats,
    toggleBought,
    removeItem,
    undoRemoveItem,
    dismissCelebration,
    clearBought,
    clearAll,
    filteredItems,
  } = useShoppingStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [lastDeletedName, setLastDeletedName] = useState('');

  // Ensure i18n is synced
  i18n.locale = language;

  useEffect(() => {
    loadItems();
    loadStats();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadItems(), loadStats()]);
    setRefreshing(false);
  }, [loadItems, loadStats]);

  const handleToggle = useCallback(
    async (id: number) => {
      await toggleBought(id);
    },
    [toggleBought]
  );

  const handleEdit = useCallback((id: number) => {
    router.push(`/item/${id}`);
  }, []);

  const handleDelete = useCallback(
    async (item: ShoppingItem) => {
      setLastDeletedName(item.name);
      await removeItem(item.id);
      setShowUndoToast(true);
    },
    [removeItem]
  );

  const handleUndo = useCallback(async () => {
    await undoRemoveItem();
    setShowUndoToast(false);
  }, [undoRemoveItem]);

  const handleClearBought = useCallback(() => {
    if (stats.boughtCount === 0) return;

    Alert.alert(
      i18n.t('list.clearBought'),
      i18n.t('list.clearBoughtConfirm'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.clear'),
          style: 'destructive',
          onPress: async () => {
            await clearBought();
          },
        },
      ]
    );
  }, [clearBought, stats.boughtCount]);

  const handleClearAll = useCallback(() => {
    if (stats.totalItems === 0) return;

    Alert.alert(
      i18n.t('list.clearAll'),
      i18n.t('list.clearAllConfirm'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.clear'),
          style: 'destructive',
          onPress: async () => {
            await clearAll();
          },
        },
      ]
    );
  }, [clearAll, stats.totalItems]);

  const handleShowMenu = useCallback(() => {
    const options: { text: string; onPress?: () => void; style?: 'cancel' | 'destructive' | 'default' }[] = [];

    if (stats.boughtCount > 0) {
      options.push({
        text: i18n.t('list.clearBought'),
        onPress: handleClearBought,
        style: 'destructive',
      });
    }

    if (stats.totalItems > 0) {
      options.push({
        text: i18n.t('list.clearAll'),
        onPress: handleClearAll,
        style: 'destructive',
      });
    }

    options.push({
      text: i18n.t('common.cancel'),
      style: 'cancel',
    });

    Alert.alert('', '', options);
  }, [handleClearBought, handleClearAll, stats.boughtCount, stats.totalItems]);

  const handleAddItem = () => {
    router.push('/item/add');
  };

  const displayItems = filteredItems();

  const renderItem = useCallback(
    ({ item }: { item: ShoppingItem }) => (
      <ShoppingItemRow
        item={item}
        onToggle={() => handleToggle(item.id)}
        onEdit={() => handleEdit(item.id)}
        onDelete={() => handleDelete(item)}
      />
    ),
    [handleToggle, handleEdit, handleDelete]
  );

  const keyExtractor = useCallback((item: ShoppingItem) => item.id.toString(), []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              {i18n.t('list.title')}
            </Text>
            <View style={styles.headerActions}>
              {stats.totalItems > 0 && (
                <SortPicker
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSortByChange={setSortBy}
                  onSortDirectionChange={setSortDirection}
                />
              )}
              {stats.totalItems > 0 && (
                <IconButton
                  icon={<MoreVertical size={20} color={colors.textSecondary} />}
                  onPress={handleShowMenu}
                  variant="ghost"
                  size="sm"
                />
              )}
            </View>
          </View>
          {stats.totalItems > 0 && (
            <View style={{ marginTop: spacing.md }}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={i18n.t('list.searchPlaceholder')}
                testID="search-input"
              />
            </View>
          )}
          <View style={{ marginTop: spacing.md }}>
            <FilterTabs
              activeFilter={filter}
              onFilterChange={setFilter}
              counts={{
                all: stats.totalItems,
                toBuy: stats.toBuyCount,
                bought: stats.boughtCount,
              }}
            />
          </View>
        </View>

        {displayItems.length === 0 ? (
          <EmptyState
            icon={
              <ShoppingCart
                size={64}
                color={colors.textTertiary}
                strokeWidth={1}
              />
            }
            title={i18n.t('list.empty')}
            description={i18n.t('list.addFirst')}
            style={{ flex: 1 }}
          />
        ) : (
          <FlatList
            data={displayItems}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={[
              styles.listContent,
              { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl + 60 },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
          />
        )}

        <View
          style={[
            styles.fab,
            {
              right: spacing.lg,
              bottom: spacing.lg,
            },
          ]}
        >
          <IconButton
            icon={<Plus size={28} color="#FFFFFF" strokeWidth={2.5} />}
            onPress={handleAddItem}
            variant="filled"
            size="lg"
            testID="add-item-fab"
            accessibilityLabel="Add item"
          />
        </View>

        <Toast
          message={`${i18n.t('list.itemDeleted')}: ${lastDeletedName}`}
          action={{
            label: i18n.t('common.undo'),
            onPress: handleUndo,
          }}
          visible={showUndoToast}
          onDismiss={() => setShowUndoToast(false)}
        />

        <CelebrationOverlay
          visible={showCelebration}
          onDismiss={dismissCelebration}
          message={i18n.t('home.noItemsLeft')}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {},
  listContent: {
    paddingTop: 8,
  },
  fab: {
    position: 'absolute',
  },
});
