import * as SQLite from 'expo-sqlite';
import {
  ShoppingItem,
  Favorite,
  UserSettings,
  Language,
  ThemeMode,
  Unit,
  Category,
  ShoppingItemFormData,
} from '../../types';

const DATABASE_NAME = 'handla.db';

let db: SQLite.SQLiteDatabase | null = null;

// Initialize the database
export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await createTables();
}

// Get database instance
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Create tables
async function createTables(): Promise<void> {
  const database = getDatabase();

  // User settings table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      language TEXT DEFAULT 'en',
      theme TEXT DEFAULT 'system',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Shopping items table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS shopping_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL DEFAULT 1,
      unit TEXT DEFAULT 'pieces',
      category TEXT DEFAULT 'other',
      is_bought INTEGER DEFAULT 0,
      is_favorite INTEGER DEFAULT 0,
      bought_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Favorites table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      default_amount REAL DEFAULT 1,
      default_unit TEXT DEFAULT 'pieces',
      category TEXT DEFAULT 'other',
      usage_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// ============ USER SETTINGS ============

export async function getUserSettings(): Promise<UserSettings | null> {
  const database = getDatabase();
  const result = await database.getFirstAsync<{
    id: number;
    name: string;
    language: string;
    theme: string;
    created_at: string;
  }>('SELECT * FROM user_settings WHERE id = 1');

  if (!result) return null;

  return {
    id: result.id,
    name: result.name,
    language: result.language as Language,
    theme: result.theme as ThemeMode,
    createdAt: result.created_at,
  };
}

export async function createUserSettings(
  name: string,
  language: Language
): Promise<UserSettings> {
  const database = getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO user_settings (id, name, language, theme) VALUES (1, ?, ?, ?)',
    [name, language, 'system']
  );
  const settings = await getUserSettings();
  if (!settings) throw new Error('Failed to create user settings');
  return settings;
}

export async function updateUserSettings(updates: {
  name?: string;
  language?: Language;
  theme?: ThemeMode;
}): Promise<void> {
  const database = getDatabase();
  const setClauses: string[] = [];
  const values: (string | number)[] = [];

  if (updates.name !== undefined) {
    setClauses.push('name = ?');
    values.push(updates.name);
  }
  if (updates.language !== undefined) {
    setClauses.push('language = ?');
    values.push(updates.language);
  }
  if (updates.theme !== undefined) {
    setClauses.push('theme = ?');
    values.push(updates.theme);
  }

  if (setClauses.length > 0) {
    await database.runAsync(
      `UPDATE user_settings SET ${setClauses.join(', ')} WHERE id = 1`,
      values
    );
  }
}

// ============ SHOPPING ITEMS ============

export async function getAllShoppingItems(): Promise<ShoppingItem[]> {
  const database = getDatabase();
  const results = await database.getAllAsync<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    category: string;
    is_bought: number;
    is_favorite: number;
    bought_at: string | null;
    created_at: string;
    updated_at: string;
  }>('SELECT * FROM shopping_items ORDER BY is_bought ASC, created_at DESC');

  return results.map((row) => ({
    id: row.id,
    name: row.name,
    amount: row.amount,
    unit: row.unit as Unit,
    category: row.category as Category,
    isBought: row.is_bought === 1,
    isFavorite: row.is_favorite === 1,
    boughtAt: row.bought_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function getShoppingItemById(
  id: number
): Promise<ShoppingItem | null> {
  const database = getDatabase();
  const result = await database.getFirstAsync<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    category: string;
    is_bought: number;
    is_favorite: number;
    bought_at: string | null;
    created_at: string;
    updated_at: string;
  }>('SELECT * FROM shopping_items WHERE id = ?', [id]);

  if (!result) return null;

  return {
    id: result.id,
    name: result.name,
    amount: result.amount,
    unit: result.unit as Unit,
    category: result.category as Category,
    isBought: result.is_bought === 1,
    isFavorite: result.is_favorite === 1,
    boughtAt: result.bought_at,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
}

export async function addShoppingItem(
  data: ShoppingItemFormData
): Promise<ShoppingItem> {
  const database = getDatabase();
  const result = await database.runAsync(
    `INSERT INTO shopping_items (name, amount, unit, category, is_favorite)
     VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.amount, data.unit, data.category, data.isFavorite ? 1 : 0]
  );

  // If marked as favorite, also add to favorites table
  if (data.isFavorite) {
    await addOrUpdateFavorite({
      name: data.name,
      defaultAmount: data.amount,
      defaultUnit: data.unit,
      category: data.category,
    });
  }

  const item = await getShoppingItemById(result.lastInsertRowId);
  if (!item) throw new Error('Failed to create shopping item');
  return item;
}

export async function updateShoppingItem(
  id: number,
  data: Partial<ShoppingItemFormData>
): Promise<void> {
  const database = getDatabase();
  const setClauses: string[] = ['updated_at = CURRENT_TIMESTAMP'];
  const values: (string | number)[] = [];

  if (data.name !== undefined) {
    setClauses.push('name = ?');
    values.push(data.name);
  }
  if (data.amount !== undefined) {
    setClauses.push('amount = ?');
    values.push(data.amount);
  }
  if (data.unit !== undefined) {
    setClauses.push('unit = ?');
    values.push(data.unit);
  }
  if (data.category !== undefined) {
    setClauses.push('category = ?');
    values.push(data.category);
  }
  if (data.isFavorite !== undefined) {
    setClauses.push('is_favorite = ?');
    values.push(data.isFavorite ? 1 : 0);
  }

  values.push(id);
  await database.runAsync(
    `UPDATE shopping_items SET ${setClauses.join(', ')} WHERE id = ?`,
    values
  );

  // If marking as favorite, also add to favorites table
  if (data.isFavorite) {
    const item = await getShoppingItemById(id);
    if (item) {
      await addOrUpdateFavorite({
        name: item.name,
        defaultAmount: item.amount,
        defaultUnit: item.unit,
        category: item.category,
      });
    }
  }
}

export async function toggleShoppingItemBought(id: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync(
    `UPDATE shopping_items SET
     is_bought = CASE WHEN is_bought = 1 THEN 0 ELSE 1 END,
     bought_at = CASE WHEN is_bought = 1 THEN NULL ELSE CURRENT_TIMESTAMP END,
     updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [id]
  );
}

export async function deleteShoppingItem(id: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync('DELETE FROM shopping_items WHERE id = ?', [id]);
}

export async function clearBoughtItems(): Promise<void> {
  const database = getDatabase();
  await database.runAsync('DELETE FROM shopping_items WHERE is_bought = 1');
}

export async function clearAllShoppingItems(): Promise<void> {
  const database = getDatabase();
  await database.runAsync('DELETE FROM shopping_items');
}

// ============ FAVORITES ============

export async function getAllFavorites(): Promise<Favorite[]> {
  const database = getDatabase();
  const results = await database.getAllAsync<{
    id: number;
    name: string;
    default_amount: number;
    default_unit: string;
    category: string;
    usage_count: number;
    created_at: string;
  }>('SELECT * FROM favorites ORDER BY usage_count DESC, name ASC');

  return results.map((row) => ({
    id: row.id,
    name: row.name,
    defaultAmount: row.default_amount,
    defaultUnit: row.default_unit as Unit,
    category: row.category as Category,
    usageCount: row.usage_count,
    createdAt: row.created_at,
  }));
}

export async function getFavoriteById(id: number): Promise<Favorite | null> {
  const database = getDatabase();
  const result = await database.getFirstAsync<{
    id: number;
    name: string;
    default_amount: number;
    default_unit: string;
    category: string;
    usage_count: number;
    created_at: string;
  }>('SELECT * FROM favorites WHERE id = ?', [id]);

  if (!result) return null;

  return {
    id: result.id,
    name: result.name,
    defaultAmount: result.default_amount,
    defaultUnit: result.default_unit as Unit,
    category: result.category as Category,
    usageCount: result.usage_count,
    createdAt: result.created_at,
  };
}

export async function addOrUpdateFavorite(data: {
  name: string;
  defaultAmount: number;
  defaultUnit: Unit;
  category: Category;
}): Promise<Favorite> {
  const database = getDatabase();
  await database.runAsync(
    `INSERT INTO favorites (name, default_amount, default_unit, category)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(name) DO UPDATE SET
     default_amount = excluded.default_amount,
     default_unit = excluded.default_unit,
     category = excluded.category`,
    [data.name, data.defaultAmount, data.defaultUnit, data.category]
  );

  const result = await database.getFirstAsync<{
    id: number;
    name: string;
    default_amount: number;
    default_unit: string;
    category: string;
    usage_count: number;
    created_at: string;
  }>('SELECT * FROM favorites WHERE name = ?', [data.name]);

  if (!result) throw new Error('Failed to create favorite');

  return {
    id: result.id,
    name: result.name,
    defaultAmount: result.default_amount,
    defaultUnit: result.default_unit as Unit,
    category: result.category as Category,
    usageCount: result.usage_count,
    createdAt: result.created_at,
  };
}

export async function incrementFavoriteUsage(id: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync(
    'UPDATE favorites SET usage_count = usage_count + 1 WHERE id = ?',
    [id]
  );
}

export async function deleteFavorite(id: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync('DELETE FROM favorites WHERE id = ?', [id]);
}

export async function addFavoritesToShoppingList(
  favoriteIds: number[]
): Promise<ShoppingItem[]> {
  const items: ShoppingItem[] = [];

  for (const id of favoriteIds) {
    const favorite = await getFavoriteById(id);
    if (favorite) {
      await incrementFavoriteUsage(id);
      const item = await addShoppingItem({
        name: favorite.name,
        amount: favorite.defaultAmount,
        unit: favorite.defaultUnit,
        category: favorite.category,
        isFavorite: true,
      });
      items.push(item);
    }
  }

  return items;
}

// ============ DATA MANAGEMENT ============

export async function clearAllData(): Promise<void> {
  const database = getDatabase();
  await database.execAsync(`
    DELETE FROM shopping_items;
    DELETE FROM favorites;
    DELETE FROM user_settings;
  `);
}

export async function getShoppingStats(): Promise<{
  totalItems: number;
  toBuyCount: number;
  boughtCount: number;
  boughtToday: number;
}> {
  const database = getDatabase();

  const total = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM shopping_items'
  );
  const toBuy = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM shopping_items WHERE is_bought = 0'
  );
  const bought = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM shopping_items WHERE is_bought = 1'
  );
  const boughtToday = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM shopping_items
     WHERE is_bought = 1 AND DATE(bought_at) = DATE('now')`
  );

  return {
    totalItems: total?.count ?? 0,
    toBuyCount: toBuy?.count ?? 0,
    boughtCount: bought?.count ?? 0,
    boughtToday: boughtToday?.count ?? 0,
  };
}
