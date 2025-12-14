import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { Button, IconButton, Toast } from '../../src/components/common';
import { GreetingHeader, StatsCard, QuickAddSection } from '../../src/components/screens';
import { useAppStore } from '../../src/store/useAppStore';
import { useShoppingStore, AddItemResult } from '../../src/store/useShoppingStore';
import { ShoppingItem, Favorite } from '../../src/types';
import { i18n } from '../../src/i18n';

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const userName = useAppStore((state) => state.userName);
  const language = useAppStore((state) => state.language);
  const {
    stats,
    loadStats,
    loadFavorites,
    loadItems,
    refreshAll,
    recentItems,
    suggestedItems,
    addItem,
    addFavoritesToList,
  } = useShoppingStore();
  const [refreshing, setRefreshing] = useState(false);
  const [greetingRefresh, setGreetingRefresh] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Ensure i18n is synced
  i18n.locale = language;

  const showToastForResult = useCallback((result: AddItemResult) => {
    if (result.toastMessage) {
      const message = i18n.t(result.toastMessage.message, {
        name: result.item.name,
        quantity: result.item.amount,
      });
      setToastMessage(message);
      setShowToast(true);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadFavorites();
    loadItems();
  }, []);

  const handleAddRecentItem = useCallback(
    async (item: ShoppingItem | Favorite) => {
      const shoppingItem = item as ShoppingItem;
      const result = await addItem({
        name: shoppingItem.name,
        amount: shoppingItem.amount,
        unit: shoppingItem.unit,
        category: shoppingItem.category,
        isFavorite: shoppingItem.isFavorite,
      });
      showToastForResult(result);
    },
    [addItem, showToastForResult]
  );

  const handleAddSuggestion = useCallback(
    async (item: ShoppingItem | Favorite) => {
      const favorite = item as Favorite;
      const results = await addFavoritesToList([favorite.id]);
      if (results.length > 0) {
        showToastForResult(results[0]);
      }
    },
    [addFavoritesToList, showToastForResult]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setGreetingRefresh((prev) => prev + 1);
    await refreshAll();
    setRefreshing(false);
  }, [refreshAll]);

  const handleStartShopping = () => {
    router.push('/(tabs)/list');
  };

  const handleAddItem = () => {
    router.push('/item/add');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xxl }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <GreetingHeader
          userName={userName}
          refreshTrigger={greetingRefresh}
        />

        <View style={[styles.statsContainer, { paddingHorizontal: spacing.lg }]}>
          <StatsCard
            toBuyCount={stats.toBuyCount}
            boughtToday={stats.boughtToday}
          />
        </View>

        <QuickAddSection
          title={i18n.t('home.recentItems')}
          icon="recent"
          items={recentItems()}
          onAddItem={handleAddRecentItem}
        />

        <QuickAddSection
          title={i18n.t('home.suggestedItems')}
          icon="suggestion"
          items={suggestedItems()}
          onAddItem={handleAddSuggestion}
        />

        <View style={[styles.actionsContainer, { padding: spacing.lg }]}>
          <Button
            title={
              stats.toBuyCount > 0
                ? i18n.t('home.viewList')
                : i18n.t('home.startShopping')
            }
            onPress={handleStartShopping}
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>

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
        />
      </View>

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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
  statsContainer: {
    marginTop: 16,
  },
  actionsContainer: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
  },
});
