import { create } from 'zustand';
import {
  ShoppingItem,
  Favorite,
  ShoppingItemFormData,
  ListFilter,
  SortOption,
  SortDirection,
} from '../types';
import {
  getAllShoppingItems,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  toggleShoppingItemBought,
  clearBoughtItems,
  clearAllShoppingItems,
  getAllFavorites,
  addOrUpdateFavorite,
  deleteFavorite,
  addFavoritesToShoppingList,
  getShoppingStats,
} from '../services/database';

interface ShoppingStats {
  totalItems: number;
  toBuyCount: number;
  boughtCount: number;
  boughtToday: number;
}

interface DeletedItem {
  item: ShoppingItem;
  deletedAt: number;
}

interface ShoppingState {
  // Data
  items: ShoppingItem[];
  favorites: Favorite[];
  stats: ShoppingStats;
  filter: ListFilter;
  searchQuery: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
  isLoading: boolean;
  deletedItems: DeletedItem[];
  showCelebration: boolean;

  // Computed
  filteredItems: () => ShoppingItem[];
  recentItems: () => ShoppingItem[];
  suggestedItems: () => Favorite[];

  // Actions
  setFilter: (filter: ListFilter) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
  loadItems: () => Promise<void>;
  loadFavorites: () => Promise<void>;
  loadStats: () => Promise<void>;
  addItem: (data: ShoppingItemFormData) => Promise<ShoppingItem>;
  editItem: (id: number, data: Partial<ShoppingItemFormData>) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  undoRemoveItem: () => Promise<void>;
  toggleBought: (id: number) => Promise<void>;
  clearBought: () => Promise<void>;
  clearAll: () => Promise<void>;
  addFavorite: (data: {
    name: string;
    defaultAmount: number;
    defaultUnit: string;
    category: string;
  }) => Promise<Favorite>;
  removeFavorite: (id: number) => Promise<void>;
  addFavoritesToList: (ids: number[]) => Promise<ShoppingItem[]>;
  refreshAll: () => Promise<void>;
  dismissCelebration: () => void;
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  // Initial state
  items: [],
  favorites: [],
  stats: {
    totalItems: 0,
    toBuyCount: 0,
    boughtCount: 0,
    boughtToday: 0,
  },
  filter: 'all',
  searchQuery: '',
  sortBy: 'dateAdded',
  sortDirection: 'desc',
  isLoading: false,
  deletedItems: [],
  showCelebration: false,

  // Computed
  filteredItems: () => {
    const { items, filter, searchQuery, sortBy, sortDirection } = get();
    let filtered = items;

    // Apply filter
    switch (filter) {
      case 'toBuy':
        filtered = filtered.filter((item) => !item.isBought);
        break;
      case 'bought':
        filtered = filtered.filter((item) => item.isBought);
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'dateAdded':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'dateUpdated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  },

  recentItems: () => {
    const { items } = get();
    // Get last 5 unique items that were bought, sorted by boughtAt
    const boughtItems = items
      .filter((item) => item.boughtAt)
      .sort((a, b) => new Date(b.boughtAt!).getTime() - new Date(a.boughtAt!).getTime());

    // Get unique names
    const seen = new Set<string>();
    const unique: ShoppingItem[] = [];
    for (const item of boughtItems) {
      if (!seen.has(item.name.toLowerCase())) {
        seen.add(item.name.toLowerCase());
        unique.push(item);
        if (unique.length >= 5) break;
      }
    }
    return unique;
  },

  suggestedItems: () => {
    const { favorites, items } = get();
    // Get top 3 favorites by usage count that aren't already in the list
    const currentItemNames = new Set(items.map((i) => i.name.toLowerCase()));
    return favorites
      .filter((f) => !currentItemNames.has(f.name.toLowerCase()))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 3);
  },

  // Actions
  setFilter: (filter) => set({ filter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortDirection: (sortDirection) => set({ sortDirection }),

  loadItems: async () => {
    set({ isLoading: true });
    try {
      const items = await getAllShoppingItems();
      set({ items });
    } catch (error) {
      console.error('Failed to load shopping items:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadFavorites: async () => {
    try {
      const favorites = await getAllFavorites();
      set({ favorites });
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  },

  loadStats: async () => {
    try {
      const stats = await getShoppingStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  },

  addItem: async (data) => {
    const item = await addShoppingItem(data);
    set((state) => ({
      items: [item, ...state.items],
      stats: {
        ...state.stats,
        totalItems: state.stats.totalItems + 1,
        toBuyCount: state.stats.toBuyCount + 1,
      },
    }));
    // If item was marked as favorite, reload favorites to update the list
    if (data.isFavorite) {
      await get().loadFavorites();
    }
    return item;
  },

  editItem: async (id, data) => {
    await updateShoppingItem(id, data);
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
      ),
    }));
    // If item was marked as favorite, reload favorites to update the list
    if (data.isFavorite) {
      await get().loadFavorites();
    }
  },

  removeItem: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;

    // Store for undo (keep only last 5 deleted items)
    set((state) => ({
      deletedItems: [
        { item, deletedAt: Date.now() },
        ...state.deletedItems.slice(0, 4),
      ],
    }));

    await deleteShoppingItem(id);
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      stats: {
        ...state.stats,
        totalItems: state.stats.totalItems - 1,
        toBuyCount: !item.isBought ? state.stats.toBuyCount - 1 : state.stats.toBuyCount,
        boughtCount: item.isBought ? state.stats.boughtCount - 1 : state.stats.boughtCount,
      },
    }));
  },

  undoRemoveItem: async () => {
    const { deletedItems } = get();
    if (deletedItems.length === 0) return;

    const [lastDeleted, ...rest] = deletedItems;
    const { item } = lastDeleted;

    // Re-add the item to the database
    const restoredItem = await addShoppingItem({
      name: item.name,
      amount: item.amount,
      unit: item.unit,
      category: item.category,
      isFavorite: item.isFavorite,
    });

    set((state) => ({
      items: [restoredItem, ...state.items],
      deletedItems: rest,
      stats: {
        ...state.stats,
        totalItems: state.stats.totalItems + 1,
        toBuyCount: state.stats.toBuyCount + 1,
      },
    }));
  },

  toggleBought: async (id) => {
    await toggleShoppingItemBought(id);
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      const wasBought = item?.isBought ?? false;
      const newToBuyCount = wasBought
        ? state.stats.toBuyCount + 1
        : state.stats.toBuyCount - 1;

      // Check if all items are now bought (celebration trigger)
      const showCelebration = !wasBought && newToBuyCount === 0 && state.stats.totalItems > 0;

      return {
        items: state.items.map((i) =>
          i.id === id
            ? {
                ...i,
                isBought: !i.isBought,
                boughtAt: !i.isBought ? new Date().toISOString() : null,
              }
            : i
        ),
        stats: {
          ...state.stats,
          toBuyCount: newToBuyCount,
          boughtCount: wasBought
            ? state.stats.boughtCount - 1
            : state.stats.boughtCount + 1,
          boughtToday: wasBought
            ? state.stats.boughtToday - 1
            : state.stats.boughtToday + 1,
        },
        showCelebration,
      };
    });
  },

  clearBought: async () => {
    await clearBoughtItems();
    set((state) => ({
      items: state.items.filter((item) => !item.isBought),
      stats: {
        ...state.stats,
        totalItems: state.stats.toBuyCount,
        boughtCount: 0,
        boughtToday: 0,
      },
    }));
  },

  clearAll: async () => {
    await clearAllShoppingItems();
    set({
      items: [],
      stats: {
        totalItems: 0,
        toBuyCount: 0,
        boughtCount: 0,
        boughtToday: 0,
      },
    });
  },

  addFavorite: async (data) => {
    const favorite = await addOrUpdateFavorite(data as Parameters<typeof addOrUpdateFavorite>[0]);
    set((state) => {
      const existingIndex = state.favorites.findIndex(
        (f) => f.name === data.name
      );
      if (existingIndex >= 0) {
        const newFavorites = [...state.favorites];
        newFavorites[existingIndex] = favorite;
        return { favorites: newFavorites };
      }
      return { favorites: [...state.favorites, favorite] };
    });
    return favorite;
  },

  removeFavorite: async (id) => {
    await deleteFavorite(id);
    set((state) => ({
      favorites: state.favorites.filter((f) => f.id !== id),
    }));
  },

  addFavoritesToList: async (ids) => {
    const newItems = await addFavoritesToShoppingList(ids);
    set((state) => ({
      items: [...newItems, ...state.items],
      stats: {
        ...state.stats,
        totalItems: state.stats.totalItems + newItems.length,
        toBuyCount: state.stats.toBuyCount + newItems.length,
      },
    }));
    // Reload favorites to update usage counts
    await get().loadFavorites();
    return newItems;
  },

  refreshAll: async () => {
    const { loadItems, loadFavorites, loadStats } = get();
    await Promise.all([loadItems(), loadFavorites(), loadStats()]);
  },

  dismissCelebration: () => set({ showCelebration: false }),
}));
