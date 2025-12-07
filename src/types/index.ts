// Language types
export type Language = 'en' | 'nl' | 'de' | 'es' | 'sv' | 'fr';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Category types
export type Category =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'frozen'
  | 'beverages'
  | 'snacks'
  | 'household'
  | 'personal'
  | 'other';

// Unit types
export type Unit =
  | 'pieces'
  | 'kg'
  | 'g'
  | 'l'
  | 'ml'
  | 'pack'
  | 'box'
  | 'bottle'
  | 'can'
  | 'jar';

// Database model interfaces
export interface UserSettings {
  id: number;
  name: string;
  language: Language;
  theme: ThemeMode;
  createdAt: string;
}

export interface ShoppingItem {
  id: number;
  name: string;
  amount: number;
  unit: Unit;
  category: Category;
  isBought: boolean;
  isFavorite: boolean;
  boughtAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: number;
  name: string;
  defaultAmount: number;
  defaultUnit: Unit;
  category: Category;
  usageCount: number;
  createdAt: string;
}

// Form data types
export interface ShoppingItemFormData {
  name: string;
  amount: number;
  unit: Unit;
  category: Category;
  isFavorite: boolean;
}

export interface FavoriteFormData {
  name: string;
  defaultAmount: number;
  defaultUnit: Unit;
  category: Category;
}

// Filter types
export type ListFilter = 'all' | 'toBuy' | 'bought';

// Sort types
export type SortOption = 'name' | 'category' | 'dateAdded' | 'dateUpdated';
export type SortDirection = 'asc' | 'desc';

// Shopping history types
export interface ShoppingSession {
  id: number;
  date: string;
  itemCount: number;
  completedAt: string | null;
}

// Streak types
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

// Navigation types
export interface FilterTab {
  key: ListFilter;
  labelKey: string;
}

// Component prop types
export interface CategoryOption {
  key: Category;
  labelKey: string;
  icon: string;
}

export interface UnitOption {
  key: Unit;
  labelKey: string;
  shortLabelKey: string;
}
